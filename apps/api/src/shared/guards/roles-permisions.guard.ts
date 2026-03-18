import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';

import { ROLES } from '@/shared/common/constants';
import { NatsClientService } from '@/shared/core/transporter/nats/nats.client.service';
import { PERMISSIONS_KEY } from '@/shared/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator';
import { ROLES_KEY } from '@/shared/decorators/roles.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly natsClientService: NatsClientService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getRequest(context: ExecutionContext) {
    switch (context.getType<GqlContextType>()) {
      case 'graphql':
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
      default: // 'http' | 'ws' | 'rpc'
        return context.switchToHttp().getRequest();
    }
  }

  private async upsertMissingRolesAndPermissions(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    return { requiredRoles, requiredPermissions };
  }

  private async validateTokenLocally(token: string) {
    const secret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'turbo-vibe-jwt-access-secret-change-me';
    const payload = this.jwtService.verify(token, { secret });

    console.log('Local token validation successful, payload:', payload);

    // TODO: Implement local user retrieval based on payload (e.g., user ID)
    const user: any = {};

    console.log('Local token validation successful for user:', user);

    if (!user) return null;

    const roles = user.UserRole.map((ur) => ur.roleName);
    const permissions = user.UserRole.flatMap((ur) =>
      ur.Role.RolePermission.map((rp) => rp.permissionName),
    );

    return {
      id: user.id,
      email: user.email,
      roles,
      permissions: [...new Set(permissions)],
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Bypass guard if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 1. Extract token from headers
    const req = await context.switchToHttp().getRequest();
    req.lang = req.headers?.lang;

    const token = req.headers?.['authorization']?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('No token provided');

    // 2. Check user roles/permissions
    const { requiredRoles, requiredPermissions } =
      await this.upsertMissingRolesAndPermissions(context);

    // 3. Validate token — try local JWT first, fall back to NATS
    let user: any = null;
    try {
      user = await this.validateTokenLocally(token);
    } catch {
      // Local validation failed, try NATS
      try {
        const verifyTokenResponse: any = await this.natsClientService.send(
          'auth-service.validate-user',
          { accessToken: token },
        );
        user = verifyTokenResponse.data;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    if (!user) {
      return false;
    }

    if (req.body && user && !isEmpty(user)) {
      req.body.user = user;
      req.body.userId = user?.id;
      req.body.lang = req.headers?.lang;
    }
    if (req.params && user && !isEmpty(user)) {
      req.params.user = user;
      req.params.userId = user?.id;
      req.params.lang = req.headers?.lang;
    }
    if (req.query && user && !isEmpty(user)) {
      req.query.user = user;
      req.query.userId = user?.id;
      req.query.lang = req.headers?.lang;
    }
    req.authorized = user?.authorized;

    if (user.roles?.includes(ROLES.SUPER_ADMIN)) return true;

    const hasRole = requiredRoles
      ? requiredRoles.some((role) => user.roles?.includes(role))
      : true;
    const hasPermission = requiredPermissions
      ? requiredPermissions.some((perm) => user.permissions?.includes(perm))
      : true;

    return hasRole && hasPermission;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

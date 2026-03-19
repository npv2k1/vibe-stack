import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from 'nestjs-prisma';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SCRYPT_KEYLEN = 64;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private hashPassword(password: string, salt: Buffer): string {
    return scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  }

  private createPasswordHash(password: string): string {
    const salt = randomBytes(16);
    const hash = this.hashPassword(password, salt);
    return `${salt.toString('hex')}:${hash}`;
  }

  private verifyPassword(plainPassword: string, storedHash: string): boolean {
    const [saltHex, hash] = storedHash.split(':');
    if (!saltHex || !hash) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const expectedHash = this.hashPassword(plainPassword, salt);
    try {
      return timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(expectedHash, 'hex'),
      );
    } catch {
      return false;
    }
  }

  private generateToken(payload: { id: number; email: string; role: string }) {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      this.logger.warn(
        'JWT_ACCESS_SECRET is not set. Using fallback secret. Set this variable in production.',
      );
    }
    const signingSecret = secret || 'turbo-vibe-jwt-access-secret-change-me';
    return this.jwtService.sign(payload, { secret: signingSecret, expiresIn: '7d' });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = this.createPasswordHash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: passwordHash,
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = this.verifyPassword(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

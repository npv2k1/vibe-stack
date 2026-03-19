import { ApiResponse } from "@vibe-stack/shared";
import { BaseService } from "../core/base.service";
import { cookiesService } from "../core/cookies.service";

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await this.post<AuthResponse>("/login", payload);
    if (res.success && res.data?.access_token) {
      cookiesService.setAuthToken(res.data.access_token);
    }
    return res;
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    const res = await this.post<AuthResponse>("/register", payload);
    if (res.success && res.data?.access_token) {
      cookiesService.setAuthToken(res.data.access_token);
    }
    return res;
  }

  logout() {
    cookiesService.remove("access_token");
  }

  getCurrentToken(): string | undefined {
    return cookiesService.getAuthToken();
  }

  isAuthenticated(): boolean {
    return !!cookiesService.getAuthToken();
  }
}

export const authService = new AuthService();

import { User, UserRole } from './types';
import { QudraStore } from './store';
import { apiGet, apiPost, apiPatch, clearToken, setToken, getToken, type ApiErrorData } from './api/client';

export interface SignUpPayload {
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
  acceptTerms?: boolean;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

function mapRemoteUser(remoteUser: Record<string, unknown>): User {
  return {
    id: String(remoteUser.id),
    email: String(remoteUser.email),
    username: (remoteUser.username as string) || String(remoteUser.email).split('@')[0],
    fullName: (remoteUser.full_name as string) || (remoteUser.fullName as string) || '',
    role: (remoteUser.role as UserRole) || 'talent',
    avatarUrl: (remoteUser.avatar_url as string) || (remoteUser.avatarUrl as string) || undefined,
    headline: (remoteUser.headline as string) || undefined,
    bio: (remoteUser.bio as string) || undefined,
    isEmailVerified: Boolean(remoteUser.is_email_verified ?? remoteUser.isEmailVerified),
    isOnboarded: Boolean(remoteUser.is_onboarded ?? remoteUser.isOnboarded),
    createdAt: (remoteUser.created_at as string) || new Date().toISOString(),
  };
}

export const AuthService = {
  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      const remoteUser = await apiGet<Record<string, unknown>>('/api/v1/users/me');
      const user = mapRemoteUser(remoteUser);
      QudraStore.setUser(user);
      return user;
    } catch (err) {
      const apiErr = err as ApiErrorData;
      if (apiErr.status === 401) {
        clearToken();
        return null;
      }
      throw err;
    }
  },

  async signUp(payload: SignUpPayload): Promise<User> {
    const remoteUser = await apiPost<Record<string, unknown>>('/api/v1/auth/register', {
      email: payload.email,
      full_name: payload.fullName,
      password: payload.password,
      role: payload.role,
    });

    const user = mapRemoteUser(remoteUser);
    QudraStore.setUser(user);
    return user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const params = new URLSearchParams();
    params.append('username', payload.email);
    params.append('password', payload.password || '');

    const data = await apiPost<{ access_token: string }>('/api/v1/auth/login', params.toString(), true);
    if (data.access_token) {
      setToken(data.access_token);
    }

    const remoteUser = await apiGet<Record<string, unknown>>('/api/v1/users/me');
    const user = mapRemoteUser(remoteUser);
    QudraStore.setUser(user);
    return user;
  },

  async verifyEmailCode(code: string): Promise<boolean> {
    try {
      const remoteUser = await apiPost<Record<string, unknown>>('/api/v1/auth/verify-email', { code });
      const user = mapRemoteUser(remoteUser);
      QudraStore.setUser(user);
      return user.isEmailVerified;
    } catch {
      return false;
    }
  },

  async completeBasicIdentity(data: {
    headline: string;
    bio: string;
    avatarUrl?: string;
  }): Promise<User> {
    const remoteUser = await apiPatch<Record<string, unknown>>('/api/v1/users/me', {
      headline: data.headline,
      bio: data.bio,
      avatar_url: data.avatarUrl,
      is_onboarded: true,
    });
    const user = mapRemoteUser(remoteUser);
    QudraStore.setUser(user);
    return user;
  },

  async logout(): Promise<void> {
    clearToken();
  },
};

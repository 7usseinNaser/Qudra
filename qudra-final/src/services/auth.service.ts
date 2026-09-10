import { User, UserRole } from './types';
import { QudraStore } from './store';

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

const getApiBase = () => {
  return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
};

export const AuthService = {
  async getCurrentUser(): Promise<User> {
    const API_BASE = getApiBase();
    const token = localStorage.getItem('qudra_auth_token');

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const remoteUser = await res.json();
          const user: User = {
            id: remoteUser.id,
            email: remoteUser.email,
            username: remoteUser.username || remoteUser.email.split('@')[0],
            fullName: remoteUser.full_name || remoteUser.fullName || '',
            role: (remoteUser.role as UserRole) || 'talent',
            avatarUrl: remoteUser.avatar_url || remoteUser.avatarUrl,
            headline: remoteUser.headline,
            bio: remoteUser.bio,
            isEmailVerified: Boolean(remoteUser.is_email_verified),
            isOnboarded: Boolean(remoteUser.is_onboarded),
            createdAt: remoteUser.created_at || new Date().toISOString(),
          };
          QudraStore.setUser(user);
          return user;
        }
      } catch {
        // Backend not reachable locally; fall back to local store cache
      }
    }

    return QudraStore.getUser();
  },

  async signUp(payload: SignUpPayload): Promise<User> {
    const API_BASE = getApiBase();

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email,
          full_name: payload.fullName,
          password: payload.password,
          role: payload.role,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          const user: User = {
            id: data.id,
            email: data.email,
            username: data.username || payload.email.split('@')[0],
            fullName: data.full_name || payload.fullName,
            role: payload.role,
            isEmailVerified: false,
            isOnboarded: false,
            createdAt: data.created_at || new Date().toISOString(),
          };
          QudraStore.setUser(user);
          return user;
        }
      }
    } catch {
      // Backend not running locally yet; fall back to local store cache
    }

    const username = payload.email.split('@')[0] || 'user';
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: payload.email,
      fullName: payload.fullName,
      username,
      role: payload.role,
      isEmailVerified: false,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    QudraStore.setUser(newUser);
    return newUser;
  },

  async login(payload: LoginPayload): Promise<User> {
    const API_BASE = getApiBase();

    try {
      const params = new URLSearchParams();
      params.append('username', payload.email);
      params.append('password', payload.password || '');

      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('qudra_auth_token', data.access_token);
        }
      }
    } catch {
      // Backend not running locally yet; fall back to local store cache
    }

    const current = QudraStore.getUser();
    if (payload.email) {
      current.email = payload.email;
      QudraStore.setUser(current);
    }
    return current;
  },

  async verifyEmailCode(code: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));
    if (code.length >= 4) {
      QudraStore.updateUser({ isEmailVerified: true });
      return true;
    }
    return false;
  },

  async completeBasicIdentity(data: {
    headline: string;
    bio: string;
    avatarUrl?: string;
  }): Promise<User> {
    await new Promise((res) => setTimeout(res, 150));
    return QudraStore.updateUser({
      headline: data.headline,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      isOnboarded: true,
    });
  },

  async logout(): Promise<void> {
    localStorage.removeItem('qudra_auth_token');
  },
};

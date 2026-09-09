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

export const AuthService = {
  async getCurrentUser(): Promise<User> {
    await new Promise(res => setTimeout(res, 80));
    return QudraStore.getUser();
  },

  async signUp(payload: SignUpPayload): Promise<User> {
    await new Promise(res => setTimeout(res, 200));
    const username = payload.email.split('@')[0] || 'user';
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: payload.email,
      fullName: payload.fullName,
      username,
      role: payload.role,
      isEmailVerified: false,
      isOnboarded: false,
      createdAt: new Date().toISOString()
    };
    QudraStore.setUser(newUser);
    return newUser;
  },

  async login(payload: LoginPayload): Promise<User> {
    await new Promise(res => setTimeout(res, 180));
    const current = QudraStore.getUser();
    if (payload.email) {
      current.email = payload.email;
      QudraStore.setUser(current);
    }
    return current;
  },

  async verifyEmailCode(code: string): Promise<boolean> {
    await new Promise(res => setTimeout(res, 250));
    // Accept valid 4 or 6 digit code or dummy '1234'
    if (code.length >= 4) {
      QudraStore.updateUser({ isEmailVerified: true });
      return true;
    }
    return false;
  },

  async completeBasicIdentity(data: { headline: string; bio: string; avatarUrl?: string }): Promise<User> {
    await new Promise(res => setTimeout(res, 150));
    return QudraStore.updateUser({
      headline: data.headline,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      isOnboarded: true
    });
  },

  async logout(): Promise<void> {
    await new Promise(res => setTimeout(res, 50));
    // Reset or keep guest state
  }
};

import { supabase } from '../lib/supabase'

export interface AuthResult {
  success: boolean
  error?: string
}

export interface SignUpParams {
  email: string
  password: string
  fullName: string
}

export interface LoginParams {
  email: string
  password: string
}

export const authService = {
  async signUp({ email, password, fullName }: SignUpParams): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      return { success: false, error: translateAuthError(error.message) }
    }

    if (data.user && !data.session) {
      return { success: true }
    }

    return { success: true }
  },

  async signIn({ email, password }: LoginParams): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: translateAuthError(error.message) }
    }

    if (!data.user) {
      return { success: false, error: 'حدث خطأ غير متوقع. حاول مرة أخرى.' }
    }

    return { success: true }
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  onAuthStateChange(callback: (userId: string | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user?.id ?? null)
    })
  },
}

function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'User already registered': 'هذا البريد مسجّل بالفعل. حاول تسجيل الدخول.',
    'Invalid login credentials': 'البريد أو كلمة المرور غير صحيحة.',
    'Email not confirmed': 'لم يتم تأكيد البريد بعد.',
    'Password should be at least 6 characters.': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.',
  }
  return map[message] ?? `حدث خطأ: ${message}`
}

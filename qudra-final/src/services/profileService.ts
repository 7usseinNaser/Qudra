import { supabase } from '../lib/supabase'
import type { DatabaseProfile } from '../lib/supabase-types'

export const profileService = {
  async getProfile(userId: string): Promise<DatabaseProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch profile:', error.message)
      return null
    }

    return data as DatabaseProfile | null
  },

  async createProfile(userId: string, fullName: string): Promise<DatabaseProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ user_id: userId, full_name: fullName })
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Failed to create profile:', error.message)
      return null
    }

    return data as DatabaseProfile | null
  },

  async updateProfile(userId: string, updates: Partial<DatabaseProfile>): Promise<DatabaseProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Failed to update profile:', error.message)
      return null
    }

    return data as DatabaseProfile | null
  },

  async ensureProfile(userId: string, fullName?: string): Promise<DatabaseProfile | null> {
    const existing = await this.getProfile(userId)
    if (existing) return existing
    if (fullName) return await this.createProfile(userId, fullName)
    return null
  },
}

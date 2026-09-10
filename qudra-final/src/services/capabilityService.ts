import { supabase } from '../lib/supabase'
import type { DatabaseUserCapability, DatabaseCapability } from '../lib/supabase-types'

export const capabilityService = {
  async getUserCapabilities(userId: string): Promise<DatabaseUserCapability[]> {
    const { data, error } = await supabase
      .from('user_capabilities')
      .select('*, capability(*)')
      .eq('user_id', userId)
      .order('strength', { ascending: false })

    if (error) {
      console.error('Failed to fetch user capabilities:', error.message)
      return []
    }

    return (data ?? []) as DatabaseUserCapability[]
  },

  async getAllCapabilities(): Promise<DatabaseCapability[]> {
    const { data, error } = await supabase
      .from('capabilities')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Failed to fetch capabilities:', error.message)
      return []
    }

    return (data ?? []) as DatabaseCapability[]
  },

  async getOrCreateCapability(name: string, category?: string): Promise<DatabaseCapability | null> {
    const { data: existing } = await supabase
      .from('capabilities')
      .select('*')
      .eq('name', name)
      .maybeSingle()

    if (existing) return existing as DatabaseCapability

    const { data, error } = await supabase
      .from('capabilities')
      .insert({ name, category: category ?? 'General' })
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Failed to create capability:', error.message)
      return null
    }

    return data as DatabaseCapability | null
  },
}

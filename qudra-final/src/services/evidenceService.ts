import { supabase } from '../lib/supabase'
import type { DatabaseEvidence, EvidenceType, VerificationStatus } from '../lib/supabase-types'

export const evidenceService = {
  async getEvidence(userId: string): Promise<DatabaseEvidence[]> {
    const { data, error } = await supabase
      .from('evidence')
      .select('*, capability(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch evidence:', error.message)
      return []
    }

    return (data ?? []) as DatabaseEvidence[]
  },

  async getEvidenceById(id: string): Promise<DatabaseEvidence | null> {
    const { data, error } = await supabase
      .from('evidence')
      .select('*, capability(*)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch evidence:', error.message)
      return null
    }

    return data as DatabaseEvidence | null
  },

  async addEvidence(userId: string, evidence: {
    capability_id?: string | null
    type: EvidenceType
    source: string
    source_url?: string | null
    title: string
    description?: string | null
    verification_status?: VerificationStatus
  }): Promise<DatabaseEvidence | null> {
    const { data, error } = await supabase
      .from('evidence')
      .insert({
        user_id: userId,
        ...evidence,
      })
      .select('*, capability(*)')
      .maybeSingle()

    if (error) {
      console.error('Failed to add evidence:', error.message)
      return null
    }

    return data as DatabaseEvidence | null
  },

  async deleteEvidence(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('evidence')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete evidence:', error.message)
      return false
    }

    return true
  },
}

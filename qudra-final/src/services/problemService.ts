import { supabase } from '../lib/supabase'
import type { DatabaseProblem, DatabaseProblemAnalysis, DatabaseProblemCapability } from '../lib/supabase-types'

export const problemService = {
  async createProblem(userId: string, data: {
    title: string
    description: string
    domain?: string
  }): Promise<DatabaseProblem | null> {
    const { data: result, error } = await supabase
      .from('problems')
      .insert({ user_id: userId, ...data })
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Failed to create problem:', error.message)
      return null
    }

    return result as DatabaseProblem | null
  },

  async getProblems(userId: string): Promise<DatabaseProblem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch problems:', error.message)
      return []
    }

    return (data ?? []) as DatabaseProblem[]
  },

  async getProblem(id: string): Promise<DatabaseProblem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch problem:', error.message)
      return null
    }

    return data as DatabaseProblem | null
  },

  async updateProblemStatus(id: string, status: DatabaseProblem['status']): Promise<boolean> {
    const { error } = await supabase
      .from('problems')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Failed to update problem status:', error.message)
      return false
    }

    return true
  },

  async getAnalysis(problemId: string): Promise<DatabaseProblemAnalysis | null> {
    const { data, error } = await supabase
      .from('problem_analyses')
      .select('*')
      .eq('problem_id', problemId)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch analysis:', error.message)
      return null
    }

    return data as DatabaseProblemAnalysis | null
  },

  async getProblemCapabilities(problemId: string): Promise<DatabaseProblemCapability[]> {
    const { data, error } = await supabase
      .from('problem_capabilities')
      .select('*, capability(*)')
      .eq('problem_id', problemId)
      .order('importance', { ascending: false })

    if (error) {
      console.error('Failed to fetch problem capabilities:', error.message)
      return []
    }

    return (data ?? []) as DatabaseProblemCapability[]
  },
}

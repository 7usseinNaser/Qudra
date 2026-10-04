/**
 * Candidates Service — QUDRA
 * Status: BACKEND_NOT_AVAILABLE (No /candidates endpoint deployed on backend yet)
 * Uses centralized prototype candidate matches with clear non-live classification.
 */

import { INITIAL_CANDIDATE_MATCHES } from './mock-data';
import { CandidateMatch } from './types';

export const CandidatesService = {
  /**
   * Status: PROTOTYPE (Backend endpoint not yet implemented)
   */
  async getAll(): Promise<CandidateMatch[]> {
    await new Promise(res => setTimeout(res, 60));
    return INITIAL_CANDIDATE_MATCHES;
  },

  async getById(id: string): Promise<CandidateMatch | undefined> {
    await new Promise(res => setTimeout(res, 40));
    return INITIAL_CANDIDATE_MATCHES.find(c => c.id === id || c.userId === id || c.name.toLowerCase().includes(id.toLowerCase()));
  },
};

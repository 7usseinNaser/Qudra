/**
 * Privacy Service — QUDRA (M25)
 * Consent state, access log, and full user-data export.
 *
 * Local-first: consent toggles persist to localStorage immediately
 * (instant revoke), then sync to backend when available.
 * Export builds a downloadable JSON snapshot of the user's data footprint.
 */

import { apiClient } from './api/client';

export interface ConsentItem {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  updatedAt: string;
  scope: string;
}

export interface AccessLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  at: string;
  ip?: string;
  result: 'allowed' | 'denied';
}

const CONSENT_STORAGE_KEY = 'qudra_consents_v1';

const DEFAULT_CONSENTS: ConsentItem[] = [
  {
    id: 'analytics',
    name: 'التحليلات المجهولة',
    description: 'إحصاءات استخدام مجهولة لتحسين المنصة — لا تتضمن نصوص مشكلاتك.',
    granted: true,
    updatedAt: new Date().toISOString(),
    scope: 'product-analytics',
  },
  {
    id: 'matching_visibility',
    name: 'الظهور في نتائج المطابقة',
    description: 'السماح بظهور ملفك العام في نتائج مطابقة أصحاب المشكلات.',
    granted: true,
    updatedAt: new Date().toISOString(),
    scope: 'matching',
  },
  {
    id: 'model_training',
    name: 'تدريب النماذج العامة',
    description: 'استخدام بياناتك لتدريب نماذج عامة. الافتراضي: مرفوض.',
    granted: false,
    updatedAt: new Date().toISOString(),
    scope: 'ai-training',
  },
  {
    id: 'marketing',
    name: 'رسائل تسويقية',
    description: 'إشعارات عن ميزات وعروض جديدة. الافتراضي: مرفوض.',
    granted: false,
    updatedAt: new Date().toISOString(),
    scope: 'marketing',
  },
  {
    id: 'third_party_sharing',
    name: 'مشاركة أطراف ثالثة',
    description: 'مشاركة أي بيانات مع جهات خارجية. الافتراضي: مرفوض.',
    granted: false,
    updatedAt: new Date().toISOString(),
    scope: 'sharing',
  },
];

const MOCK_ACCESS_LOG: AccessLogEntry[] = [
  { id: 'log_001', actor: 'أنت', action: 'تصدير البيانات', resource: 'user-data-export.json', at: '2026-09-20T14:00:00Z', result: 'allowed' },
  { id: 'log_002', actor: 'نظام المطابقة', action: 'قراءة القدرات الموثقة', resource: 'capabilities:read', at: '2026-09-18T11:30:00Z', result: 'allowed' },
  { id: 'log_003', actor: 'صاحب مشكلة', action: 'عرض الملف العام', resource: 'profile:public', at: '2026-09-15T09:12:00Z', result: 'allowed' },
  { id: 'log_004', actor: 'طرف ثالث', action: 'طلب مشاركة بيانات', resource: 'sharing:export', at: '2026-09-10T16:45:00Z', result: 'denied' },
];

function readLocal(): ConsentItem[] {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENTS;
    const parsed = JSON.parse(raw) as ConsentItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CONSENTS;
    return parsed;
  } catch {
    return DEFAULT_CONSENTS;
  }
}

function writeLocal(items: ConsentItem[]) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable — state still updates in-memory via caller
  }
}

export const PrivacyService = {
  /** Load consent list (local-first, instant). */
  async getConsents(): Promise<ConsentItem[]> {
    await new Promise((r) => setTimeout(r, 120));
    return readLocal();
  },

  /**
   * Grant or revoke a consent — applies locally instantly,
   * then attempts backend sync (non-blocking on failure).
   */
  async setConsent(id: string, granted: boolean): Promise<ConsentItem[]> {
    const items = readLocal().map((c) =>
      c.id === id ? { ...c, granted, updatedAt: new Date().toISOString() } : c,
    );
    writeLocal(items);
    try {
      await apiClient.post('/api/v1/privacy/consents', { consent_id: id, granted });
    } catch {
      // offline / backend unavailable — local state is source of truth
    }
    return items;
  },

  /** Revoke all consents instantly (local + best-effort backend). */
  async revokeAll(): Promise<ConsentItem[]> {
    const items = readLocal().map((c) => ({ ...c, granted: false, updatedAt: new Date().toISOString() }));
    writeLocal(items);
    try {
      await apiClient.post('/api/v1/privacy/consents/revoke-all', {});
    } catch {
      // non-blocking
    }
    return items;
  },

  /** Access log (backend when available, mock fallback). */
  async getAccessLog(): Promise<AccessLogEntry[]> {
    try {
      const res = await apiClient.get<AccessLogEntry[]>('/api/v1/privacy/access-log');
      if (Array.isArray(res) && res.length) return res;
      return MOCK_ACCESS_LOG;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
      return MOCK_ACCESS_LOG;
    }
  },

  /**
   * Build a full user-data export snapshot and trigger a JSON download.
   * Returns the filename used.
   */
  async exportAll(filename = 'qudra-my-data.json'): Promise<string> {
    let snapshot: Record<string, unknown> = {};
    try {
      snapshot = await apiClient.get<Record<string, unknown>>('/api/v1/privacy/export');
    } catch {
      // Fallback: assemble from local sources
      let profile: unknown = null;
      let problems: unknown = null;
      try {
        profile = JSON.parse(localStorage.getItem('qudra_profile_snapshot') || 'null');
      } catch {
        profile = null;
      }
      try {
        const { ProblemsService } = await import('./problems.service');
        problems = await ProblemsService.getAll();
      } catch {
        problems = [];
      }
      snapshot = {
        exported_at: new Date().toISOString(),
        source: 'local-fallback',
        consents: readLocal(),
        profile,
        problems,
        note: 'Backend export unavailable — local snapshot assembled client-side.',
      };
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return filename;
  },
};
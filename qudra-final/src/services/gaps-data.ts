import { GapDetail} from './types';
import { INITIAL_GAPS } from './mock-data';

export type { GapDetail };

export interface GapsDataResponse {
  gaps: GapDetail[];
  primaryGap: GapDetail | null;
  nextBestAction: {
    label: string;
    href?: string;
    onClick?: () => void;
    confidence: number;
    reasoning: string;
    unknowns?: string[];
  } | null;
  unknowns: string[];
  timestamp: string;
}

function calculatePrimaryGap(gaps: GapDetail[]): GapDetail | null {
  if (gaps.length === 0) return null;
  
  const criticalGaps = gaps.filter(g => g.severity === 'critical');
  if (criticalGaps.length > 0) {
    return criticalGaps.reduce((prev, curr) => 
      curr.gapDelta > prev.gapDelta ? curr : prev
    );
  }
  
  return gaps.reduce((prev, curr) => 
    curr.gapDelta > prev.gapDelta ? curr : prev
  );
}

function generateNextBestAction(primaryGap: GapDetail | null): NonNullable<GapsDataResponse['nextBestAction']> | null {
  if (!primaryGap) {
    return null;
  }

  const severityWeight = primaryGap.severity === 'critical' ? 0.9 : primaryGap.severity === 'moderate' ? 0.7 : 0.5;
  const confidence = Math.round(severityWeight * 100);

  return {
    label: primaryGap.recommendedAction || primaryGap.suggestedAction,
    confidence,
    reasoning: `الفجوة الأكبر: ${primaryGap.skill} (${primaryGap.currentStrength}% → ${primaryGap.targetStrength || primaryGap.requiredStrength}%). ${primaryGap.whyItMatters}`,
    unknowns: [
      'مستوى الإتقان الفعلي بعد إكمال المسار المقترح',
      'مدى توفر فرص عملية لتطبيق المهارة في مشاريع حقيقية',
      'توقيت استجابة المنصة للتحديثات الجديدة في ملفك',
    ],
  };
}

export const GapsDataService = {
  async getGapsData(): Promise<GapsDataResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gaps = INITIAL_GAPS;
    const primaryGap = calculatePrimaryGap(gaps);
    const nextBestAction = generateNextBestAction(primaryGap);
    
    return {
      gaps,
      primaryGap,
      nextBestAction,
      unknowns: nextBestAction?.unknowns || [],
      timestamp: new Date().toISOString(),
    };
  },

  async getPrimaryGap(): Promise<GapDetail | null> {
    const data = await this.getGapsData();
    return data.primaryGap;
  },

  async getNextBestAction(): Promise<GapsDataResponse['nextBestAction']> {
    const data = await this.getGapsData();
    return data.nextBestAction;
  },
};

export default GapsDataService;
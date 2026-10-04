import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './ExplainDrawer.module.css';

interface EvidenceRef {
  id: string;
  title: string;
  type: string;
  status: string;
  strength: number;
}

interface ExplainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  conclusion?: string;
  evidence?: EvidenceRef[];
  inferences?: string[];
  confidence?: number;
  unknowns?: string[];
  nextAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export const ExplainDrawer: React.FC<ExplainDrawerProps> = ({
  isOpen,
  onClose,
  title = 'تفسير الذكاء الاصطناعي',
  conclusion,
  evidence = [],
  inferences = [],
  confidence,
  unknowns = [],
  nextAction,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="explain-drawer-title"
          >
            <div className={styles.header}>
              <h2 id="explain-drawer-title" className={styles.title}>
                {title}
              </h2>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="إغلاق التفسير"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.content}>
              {conclusion && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>النتيجة</h3>
                  <p className={styles.text}>{conclusion}</p>
                </section>
              )}

              {evidence.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>الأدلة المسندة ({evidence.length})</h3>
                  <ul className={styles.evidenceList}>
                    {evidence.map((e) => (
                      <li key={e.id} className={styles.evidenceItem}>
                        <span className={styles.evidenceTitle}>{e.title}</span>
                        <span className={styles.evidenceMeta}>
                          {e.type} • {e.status} • ثقة {e.strength}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {inferences.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>الاستنتاجات</h3>
                  <ul className={styles.inferenceList}>
                    {inferences.map((inf, i) => (
                      <li key={i} className={styles.inferenceItem}>{inf}</li>
                    ))}
                  </ul>
                </section>
              )}

              {confidence !== undefined && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>درجة اليقين</h3>
                  <div className={styles.confidenceBar}>
                    <motion.div
                      className={styles.confidenceFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(confidence)}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span className={styles.confidenceValue}>
                      {Math.round(confidence)}%
                    </span>
                  </div>
                </section>
              )}

              {unknowns.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>المجاهيل / ما لا نعلمه</h3>
                  <ul className={styles.unknownList}>
                    {unknowns.map((u, i) => (
                      <li key={i} className={styles.unknownItem}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className={styles.unknownIcon}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        {u}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {nextAction && (
                <section className={styles.section} style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                  <h3 className={styles.sectionTitle}>الخطوة التالية المقترحة</h3>
                  {nextAction.href ? (
                    <a
                      href={nextAction.href}
                      className={styles.nextActionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {nextAction.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" style={{ marginRight: '0.35rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      className={styles.nextActionBtn}
                      onClick={nextAction.onClick}
                    >
                      {nextAction.label}
                    </button>
                  )}
                </section>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExplainDrawer;
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
  onReset?: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetKeys && this.props.resetKeys.length > 0) {
      const hasResetKeyChanged = this.props.resetKeys.some(
        (key, idx) => key !== prevProps.resetKeys?.[idx]
      );
      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container} role="alert" aria-live="assertive">
          <div className={styles.iconWrapper}>
            <AlertTriangle size={32} aria-hidden="true" />
          </div>

          <h2 className={styles.title}>حدث خطأ غير متوقع</h2>

          <p className={styles.message}>
            واجهنا مشكلة أثناء عرض هذه الصفحة. فريق التطوير تم إشعاره تلقائياً.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <details className={styles.details}>
              <summary className={styles.summary}>تفاصيل التقنية (للمطورين)</summary>
              <pre className={styles.errorText}>
                {this.state.error.name}: {this.state.error.message}
                {this.state.error.stack && `\n\n${this.state.error.stack}`}
              </pre>
            </details>
          )}

          <div className={styles.actions}>
            <Button
              variant="proof"
              size="md"
              onClick={this.reset}
              leftIcon={<RefreshCw size={16} />}
            >
              إعادة تحميل الصفحة
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => window.location.href = '/'}
              leftIcon={<Home size={16} />}
            >
              العودة للرئيسية
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${this.state.error?.name}: ${this.state.error?.message}\n\n${this.state.error?.stack}`
                );
              }}
              leftIcon={<Bug size={16} />}
            >
              نسخ الخطأ
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
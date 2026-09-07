import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export interface QudraLogoProps {
  size?: number | string
  width?: number | string
  height?: number | string
  variant?: 'icon' | 'wordmark'
  className?: string
  alt?: string
  style?: React.CSSProperties
  'aria-hidden'?: boolean | 'true' | 'false'
}

/**
 * QudraLogo — المكوّن الموحّد لشعار منصة قُدرة.
 *
 * يستدعي الأصول الأصلية المعتمدة فقط من public/assets/:
 * - variant='icon': الأيقونة الدائرية الأصلية qudra-icon.webp (مع qudra-icon.png كـ fallback).
 * - variant='wordmark': الشعار الكامل بنص قُدرة الأصلي (qudra-wordmark.webp للفاتح و qudra-wordmark-dark.webp للداكن).
 */
export const QudraLogo: React.FC<QudraLogoProps> = ({
  size = 26,
  width,
  height,
  variant = 'icon',
  className = '',
  alt = 'قُدرة',
  style,
  'aria-hidden': ariaHidden,
}) => {
  const { theme } = useTheme()

  if (variant === 'wordmark') {
    const wordmarkSrc = theme === 'dark' ? '/assets/qudra-wordmark-dark.webp' : '/assets/qudra-wordmark.webp'
    const computedWidth = width ?? size ?? 240
    const computedHeight = height ?? 'auto'

    return (
      <img
        src={wordmarkSrc}
        alt={alt}
        className={className}
        width={typeof computedWidth === 'number' ? computedWidth : undefined}
        height={typeof computedHeight === 'number' ? computedHeight : undefined}
        style={{
          width: computedWidth,
          height: computedHeight,
          aspectRatio: '620/278',
          objectFit: 'contain',
          display: 'inline-block',
          ...style,
        }}
        aria-hidden={ariaHidden}
      />
    )
  }

  const computedSize = width ?? height ?? size
  return (
    <picture
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <source srcSet="/assets/qudra-icon.webp" type="image/webp" />
      <img
        src="/assets/qudra-icon.png"
        alt={alt}
        width={typeof computedSize === 'number' ? computedSize : undefined}
        height={typeof computedSize === 'number' ? computedSize : undefined}
        style={{
          width: computedSize,
          height: computedSize,
          objectFit: 'contain',
          display: 'inline-block',
        }}
        aria-hidden={ariaHidden}
      />
    </picture>
  )
}

export default QudraLogo

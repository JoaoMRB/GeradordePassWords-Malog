import { ChevronDown, Copy, Eye, EyeOff, RefreshCw, Shield, Zap, Hash, Infinity, Clock } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'
import { ColoredPassword } from './ColoredPassword'

interface ResultDisplayProps {
  lang: Language
  value: string
  hidden: boolean
  pulsing: boolean
  placeholder: string
  onToggleHidden: () => void
  onCopy: () => void
  onRegenerate: () => void
}

export function ResultDisplay({
  lang,
  value,
  hidden,
  pulsing,
  placeholder,
  onToggleHidden,
  onCopy,
  onRegenerate,
}: ResultDisplayProps) {
  return (
    <div className="result-section">
      <div className={`result-display ${pulsing ? 'pulse' : ''}`}>
        <div className="result-input-wrap">
          <ColoredPassword password={value} hidden={hidden} placeholder={placeholder} />
        </div>
        <div className="result-actions">
          <button
            type="button"
            className="action-btn"
            onClick={onToggleHidden}
            aria-label={hidden ? t(lang, 'show') : t(lang, 'hide')}
            title={hidden ? t(lang, 'show') : t(lang, 'hide')}
          >
            {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={onCopy}
            disabled={!value}
            aria-label={t(lang, 'copy')}
            title={t(lang, 'copy')}
          >
            <Copy size={18} />
          </button>
          <button
            type="button"
            className="action-btn primary"
            onClick={onRegenerate}
            aria-label={t(lang, 'regenerate')}
          >
            <RefreshCw size={16} />
            {t(lang, 'regenerate')}
          </button>
        </div>
      </div>
    </div>
  )
}

interface StrengthMeterProps {
  lang: Language
  label: string
  width: string
  color: string
  tip: string
  charCount: number
}

export function StrengthMeter({ lang, label, width, color, tip, charCount }: StrengthMeterProps) {
  const strengthMap: Record<string, 'strengthNone' | 'strengthWeak' | 'strengthMedium' | 'strengthStrong' | 'strengthVeryStrong'> = {
    none: 'strengthNone',
    weak: 'strengthWeak',
    medium: 'strengthMedium',
    strong: 'strengthStrong',
    veryStrong: 'strengthVeryStrong',
  }

  const tipParts = tip.split('|').map((part) => t(lang, part as Parameters<typeof t>[1]))

  return (
    <div className="strength-container">
      <div className="strength-header">
        <span>
          {t(lang, 'strength')}:{' '}
          <span className="strength-text" style={{ color }}>
            {t(lang, strengthMap[label] ?? 'strengthNone')}
          </span>
        </span>
        <span className="char-count">
          {charCount} {t(lang, 'characters')}
        </span>
      </div>
      <div className="strength-bar-track">
        <div className="strength-bar-fill" style={{ width, backgroundColor: color }} />
      </div>
      <p className="strength-tip">{tipParts.join(' ')}</p>
    </div>
  )
}

interface SecurityDetailsProps {
  lang: Language
  entropy: number
  charsetSize: number
  combinations: string
  crackTime: string
  expanded: boolean
  onToggle: () => void
}

export function SecurityDetails({
  lang,
  entropy,
  charsetSize,
  combinations,
  crackTime,
  expanded,
  onToggle,
}: SecurityDetailsProps) {
  const entropyPercent = Math.min(100, Math.round((entropy / 128) * 100))
  const entropyLevel =
    entropy >= 80 ? 'excellent' : entropy >= 50 ? 'good' : entropy >= 30 ? 'fair' : 'low'

  const metrics = [
    {
      icon: Zap,
      label: t(lang, 'entropy'),
      value: `${entropy} bits`,
      accent: 'entropy',
      extra: (
        <div className="sec-entropy-bar">
          <div
            className={`sec-entropy-fill sec-entropy-fill--${entropyLevel}`}
            style={{ width: `${entropyPercent}%` }}
          />
        </div>
      ),
    },
    {
      icon: Hash,
      label: t(lang, 'charsetSize'),
      value: charsetSize.toLocaleString(),
      accent: 'charset',
    },
    {
      icon: Infinity,
      label: t(lang, 'combinations'),
      value: combinations,
      accent: 'combinations',
    },
    {
      icon: Clock,
      label: t(lang, 'crackTime'),
      value: crackTime,
      accent: 'crack',
      wide: true,
    },
  ]

  return (
    <div className={`security-details-box ${expanded ? 'security-details-box--open' : ''}`}>
      <button
        type="button"
        className="security-details-trigger"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="security-details-trigger-left">
          <span className="security-details-icon-wrap" aria-hidden="true">
            <Shield size={15} />
          </span>
          <div className="security-details-trigger-text">
            <span className="security-details-title">{t(lang, 'securityDetails')}</span>
            {!expanded && entropy > 0 && (
              <span className="security-details-preview">
                {entropy} bits · {crackTime}
              </span>
            )}
          </div>
        </div>
        <span className={`security-details-chevron ${expanded ? 'security-details-chevron--open' : ''}`}>
          <ChevronDown size={16} />
        </span>
      </button>

      <div className={`security-details-panel ${expanded ? 'security-details-panel--open' : ''}`}>
        <div className="security-details-grid">
          {metrics.map(({ icon: Icon, label, value, accent, extra, wide }) => (
            <div
              key={label}
              className={`sec-detail-card sec-detail-card--${accent}${wide ? ' sec-detail-card--wide' : ''}`}
            >
              <div className="sec-detail-card-header">
                <span className={`sec-detail-icon sec-detail-icon--${accent}`} aria-hidden="true">
                  <Icon size={14} />
                </span>
                <span className="sec-detail-label">{label}</span>
              </div>
              <span className="sec-detail-value">{value}</span>
              {extra}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ClipboardSecurerProps {
  lang: Language
  active: boolean
  remaining: number
  progress: number
}

export function ClipboardSecurer({ lang, active, remaining, progress }: ClipboardSecurerProps) {
  if (!active) return null

  return (
    <div className="clipboard-securer">
      <ShieldIcon />
      <div className="securer-content">
        <span>{t(lang, 'clipboardClearing', { s: remaining })}</span>
        <div className="securer-progress-track">
          <div className="securer-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg className="securer-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  )
}

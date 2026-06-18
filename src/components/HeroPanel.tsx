import { Shield, Wifi, WifiOff, Zap } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'

interface HeroPanelProps {
  lang: Language
}

export function HeroPanel({ lang }: HeroPanelProps) {
  const features = [
    { icon: Shield, key: 'heroFeature1' as const },
    { icon: Zap, key: 'heroFeature2' as const },
    { icon: WifiOff, key: 'heroFeature3' as const },
    { icon: Wifi, key: 'heroFeature4' as const },
  ]

  return (
    <aside className="hero-panel">
      <div className="hero-badge">{t(lang, 'appTagline')}</div>
      <h1 className="hero-title">{t(lang, 'heroTitle')}</h1>
      <p className="hero-subtitle">{t(lang, 'heroSubtitle')}</p>

      <ul className="hero-features">
        {features.map(({ icon: Icon, key }) => (
          <li key={key}>
            <Icon size={16} aria-hidden="true" />
            <span>{t(lang, key)}</span>
          </li>
        ))}
      </ul>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-lock-ring" />
        <div className="hero-lock-ring hero-lock-ring--delayed" />
        <svg className="hero-lock-icon" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </aside>
  )
}

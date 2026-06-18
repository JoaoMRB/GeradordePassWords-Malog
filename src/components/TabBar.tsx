import { KeyRound, Quote } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'

interface TabBarProps {
  lang: Language
  active: 'password' | 'passphrase'
  onChange: (tab: 'password' | 'passphrase') => void
}

export function TabBar({ lang, active, onChange }: TabBarProps) {
  return (
    <div className="tabs-bar" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'password'}
        className={`tab-btn ${active === 'password' ? 'active' : ''}`}
        onClick={() => onChange('password')}
      >
        <KeyRound size={16} />
        {t(lang, 'tabPassword')}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'passphrase'}
        className={`tab-btn ${active === 'passphrase' ? 'active' : ''}`}
        onClick={() => onChange('passphrase')}
      >
        <Quote size={16} />
        {t(lang, 'tabPassphrase')}
      </button>
    </div>
  )
}

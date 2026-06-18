import { Moon, Sun } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'

interface HeaderProps {
  lang: Language
  onLangChange: (lang: Language) => void
  onToggleTheme: () => void
  isDark: boolean
}

export function Header({ lang, onLangChange, onToggleTheme, isDark }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="logo-text">{t(lang, 'appName')}</span>
      </div>

      <div className="header-controls">
        <div className="lang-selector" role="group" aria-label="Language">
          <button
            type="button"
            className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
            onClick={() => onLangChange('pt')}
          >
            PT
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => onLangChange('en')}
          >
            EN
          </button>
        </div>
        <button
          type="button"
          className="theme-button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}

import { Shield } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'

export function Footer({ lang }: { lang: Language }) {
  return (
    <footer className="app-footer">
      <div className="security-banner">
        <Shield size={16} aria-hidden="true" />
        <p>{t(lang, 'footerSecurity')}</p>
      </div>
      <p className="footer-bottom">
        {t(lang, 'footerCreditPrefix')}{' '}
        <a
          href="https://github.com/JoaoMRB"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-author-link"
        >
          Malog
        </a>
      </p>
      <p className="keyboard-hint">{t(lang, 'keyboardHint')}</p>
    </footer>
  )
}

interface StatusStripProps {
  lang: Language
  profile: string
  typeCount: number
  outputCount: number
}

export function StatusStrip({ lang, profile, typeCount, outputCount }: StatusStripProps) {
  return (
    <div className="status-strip">
      <div className="status-pill">
        <span className="status-label">{t(lang, 'profile')}</span>
        <strong>{profile}</strong>
      </div>
      <div className="status-pill">
        <span className="status-label">{t(lang, 'complexity')}</span>
        <strong>
          {typeCount} {t(lang, 'types')}
        </strong>
      </div>
      <div className="status-pill">
        <span className="status-label">{t(lang, 'output')}</span>
        <strong>
          {outputCount} {t(lang, 'passwords')}
        </strong>
      </div>
    </div>
  )
}

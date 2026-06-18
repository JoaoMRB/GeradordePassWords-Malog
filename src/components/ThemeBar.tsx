import type { ColorTheme, Language } from '../types'
import { COLOR_THEMES } from '../lib/constants'
import { t } from '../lib/i18n'

interface ThemeBarProps {
  lang: Language
  active: ColorTheme
  onChange: (theme: ColorTheme) => void
}

export function ThemeBar({ lang, active, onChange }: ThemeBarProps) {
  return (
    <div className="theme-bar" role="group" aria-label={t(lang, 'theme')}>
      <span className="theme-label">{t(lang, 'theme')}</span>
      {COLOR_THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          className={`theme-dot ${active === theme ? 'active' : ''}`}
          data-theme-name={theme}
          onClick={() => onChange(theme)}
          aria-label={theme}
          aria-pressed={active === theme}
        />
      ))}
    </div>
  )
}

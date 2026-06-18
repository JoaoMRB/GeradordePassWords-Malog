import { Volume2, VolumeX } from 'lucide-react'
import type { Language, PasswordSettings, PresetId } from '../types'
import { LENGTH_MAX } from '../lib/constants'
import { t } from '../lib/i18n'

interface ConfigPanelProps {
  lang: Language
  settings: PasswordSettings
  lengthMin: number
  activePreset: PresetId
  clipboardClearEnabled: boolean
  soundEnabled: boolean
  lengthHint: string
  onSettingsChange: (patch: Partial<PasswordSettings>) => void
  onPreset: (preset: PresetId) => void
  onClipboardClearToggle: (enabled: boolean) => void
  onSoundToggle: (enabled: boolean) => void
}

export function ConfigPanel({
  lang,
  settings,
  lengthMin,
  activePreset,
  clipboardClearEnabled,
  soundEnabled,
  lengthHint,
  onSettingsChange,
  onPreset,
  onClipboardClearToggle,
  onSoundToggle,
}: ConfigPanelProps) {
  const presets: { id: PresetId; label: string }[] = [
    { id: 'readable', label: t(lang, 'presetReadable') },
    { id: 'secure', label: t(lang, 'presetSecure') },
    { id: 'pin', label: t(lang, 'presetPin') },
  ]

  const options = [
    { key: 'upper' as const, label: t(lang, 'uppercase'), desc: t(lang, 'uppercaseDesc') },
    { key: 'lower' as const, label: t(lang, 'lowercase'), desc: t(lang, 'lowercaseDesc') },
    { key: 'number' as const, label: t(lang, 'numbers'), desc: t(lang, 'numbersDesc') },
    { key: 'symbol' as const, label: t(lang, 'symbols'), desc: t(lang, 'symbolsDesc') },
    {
      key: 'avoidSimilar' as const,
      label: t(lang, 'avoidSimilar'),
      desc: t(lang, 'avoidSimilarDesc'),
      wide: true,
    },
    {
      key: 'clipboard' as const,
      label: t(lang, 'clipboardClear'),
      desc: t(lang, 'clipboardClearDesc'),
      wide: true,
      isClipboard: true,
    },
  ]

  return (
    <div className="config-section">
      <div className="config-group">
        <h3>{t(lang, 'presets')}</h3>
        <div className="presets-row">
          {presets.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`preset-btn ${activePreset === id ? 'active' : ''}`}
              onClick={() => onPreset(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="config-group">
        <h3>{t(lang, 'length')}</h3>
        <div className="range-slider-group">
          <div className="range-slider-row">
            <input
              type="range"
              className="range-slider"
              min={lengthMin}
              max={LENGTH_MAX}
              value={settings.length}
              onChange={(e) => onSettingsChange({ length: Number(e.target.value) })}
            />
            <input
              type="number"
              min={lengthMin}
              max={LENGTH_MAX}
              value={settings.length}
              onChange={(e) => onSettingsChange({ length: Number(e.target.value) })}
              aria-label={t(lang, 'length')}
            />
          </div>
          <div className="range-labels">
            <span>{t(lang, 'shortLength')}</span>
            <span>{t(lang, 'balancedLength')}</span>
            <span>{t(lang, 'maxLength')}</span>
          </div>
          <p className="length-hint">{lengthHint}</p>
        </div>
      </div>

      <div className="config-grid-2">
        <div className="config-group">
          <h3>{t(lang, 'quantity')}</h3>
          <div className="quantity-input-wrap">
            <span>{t(lang, 'passwords')}</span>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.count}
              onChange={(e) => onSettingsChange({ count: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="config-group">
          <h3>{t(lang, 'sound')}</h3>
          <div className="sound-toggle-wrap">
            <span className={`sound-toggle-label ${soundEnabled ? 'sound-toggle-label--on' : ''}`}>
              {soundEnabled ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
              {soundEnabled ? t(lang, 'soundOn') : t(lang, 'soundOff')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              aria-label={t(lang, 'sound')}
              className={`sound-toggle ${soundEnabled ? 'sound-toggle--on' : ''}`}
              onClick={() => onSoundToggle(!soundEnabled)}
            >
              <span className="sound-toggle-track" aria-hidden="true">
                <span className="sound-toggle-thumb" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="config-group">
        <h3>{t(lang, 'charset')}</h3>
        <div className="options-grid">
          {options.map((opt) => {
            if ('isClipboard' in opt && opt.isClipboard) {
              return (
                <label key={opt.key} className="option-checkbox col-span-2">
                  <input
                    type="checkbox"
                    checked={clipboardClearEnabled}
                    onChange={(e) => onClipboardClearToggle(e.target.checked)}
                  />
                  <span className="custom-check" />
                  <span className="option-text-stack">
                    <span className="option-label">{opt.label}</span>
                    <span className="option-desc">{opt.desc}</span>
                  </span>
                </label>
              )
            }
            const settingKey = opt.key as keyof PasswordSettings
            return (
              <label
                key={opt.key}
                className={`option-checkbox ${'wide' in opt && opt.wide ? 'col-span-2' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={settings[settingKey] as boolean}
                  onChange={(e) => onSettingsChange({ [settingKey]: e.target.checked })}
                />
                <span className="custom-check" />
                <span className="option-text-stack">
                  <span className="option-label">{opt.label}</span>
                  <span className="option-desc">{opt.desc}</span>
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface PassphraseConfigProps {
  lang: Language
  wordCount: number
  separator: string
  capitalize: boolean
  includeNumber: boolean
  onWordCountChange: (n: number) => void
  onSeparatorChange: (s: string) => void
  onCapitalizeChange: (v: boolean) => void
  onIncludeNumberChange: (v: boolean) => void
}

export function PassphraseConfig({
  lang,
  wordCount,
  separator,
  capitalize,
  includeNumber,
  onWordCountChange,
  onSeparatorChange,
  onCapitalizeChange,
  onIncludeNumberChange,
}: PassphraseConfigProps) {
  return (
    <div className="config-section">
      <p className="passphrase-tip">{t(lang, 'passphraseTip')}</p>

      <div className="config-group">
        <h3>{t(lang, 'wordCount')}</h3>
        <div className="range-slider-group">
          <div className="range-slider-row">
            <input
              type="range"
              className="range-slider"
              min={3}
              max={8}
              value={wordCount}
              onChange={(e) => onWordCountChange(Number(e.target.value))}
            />
            <input
              type="number"
              min={3}
              max={8}
              value={wordCount}
              onChange={(e) => onWordCountChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="config-grid-2">
        <div className="config-group">
          <h3>{t(lang, 'separator')}</h3>
          <div className="separator-input-wrap">
            <input
              type="text"
              maxLength={3}
              value={separator}
              onChange={(e) => onSeparatorChange(e.target.value)}
              className="separator-input"
            />
          </div>
        </div>
      </div>

      <div className="options-grid">
        <label className="option-checkbox">
          <input type="checkbox" checked={capitalize} onChange={(e) => onCapitalizeChange(e.target.checked)} />
          <span className="custom-check" />
          <span className="option-label">{t(lang, 'capitalize')}</span>
        </label>
        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={includeNumber}
            onChange={(e) => onIncludeNumberChange(e.target.checked)}
          />
          <span className="custom-check" />
          <span className="option-label">{t(lang, 'includeNumber')}</span>
        </label>
      </div>
    </div>
  )
}

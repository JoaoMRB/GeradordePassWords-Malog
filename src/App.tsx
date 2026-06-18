import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  ColorTheme,
  GeneratorTab,
  HistoryEntry,
  PassphraseSettings,
  PasswordSettings,
  PresetId,
} from './types'
import {
  DEFAULT_PASSPHRASE_SETTINGS,
  DEFAULT_PASSWORD_SETTINGS,
  HISTORY_MAX,
  STORAGE_KEYS,
} from './lib/constants'
import { generatePassphrase, getPassphraseEntropy } from './lib/passphrase'
import {
  generatePasswords,
  getLengthMin,
  getProfileKey,
  validateSettings,
} from './lib/password'
import { evaluateStrength, computeSecurityMetrics } from './lib/strength'
import { t } from './lib/i18n'
import { playCopySound, playRegenerateSound } from './lib/sound'
import { useLanguage } from './hooks/useLanguage'
import { useTheme } from './hooks/useTheme'
import { useClipboardSecurer } from './hooks/useClipboardSecurer'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Header } from './components/Header'
import { ThemeBar } from './components/ThemeBar'
import { HeroPanel } from './components/HeroPanel'
import { TabBar } from './components/TabBar'
import { ResultDisplay, StrengthMeter, SecurityDetails, ClipboardSecurer, Toast } from './components/ResultDisplay'
import { ConfigPanel, PassphraseConfig } from './components/ConfigPanel'
import { BatchList, HistoryPanel } from './components/BatchList'
import { Footer, StatusStrip } from './components/Footer'

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

function normalizeSettings(raw: PasswordSettings, lengthMin: number): PasswordSettings {
  return {
    length: clamp(raw.length, lengthMin, 64),
    count: clamp(raw.count, 1, 10),
    upper: raw.upper,
    lower: raw.lower,
    number: raw.number,
    symbol: raw.symbol,
    avoidSimilar: raw.avoidSimilar,
  }
}

export default function App() {
  const { lang, setLang } = useLanguage()
  const { toggleMode, setColorTheme, getMode, getColor } = useTheme()
  const [themeTick, setThemeTick] = useState(0)

  const [settings, setSettings] = useLocalStorage<PasswordSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_PASSWORD_SETTINGS,
  )
  const [passphraseSettings, setPassphraseSettings] = useLocalStorage<PassphraseSettings>(
    'purepass-passphrase-settings',
    DEFAULT_PASSPHRASE_SETTINGS,
  )
  const [clipboardClearEnabled, setClipboardClearEnabled] = useLocalStorage<boolean>(
    STORAGE_KEYS.clipboardClear,
    true,
  )
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(STORAGE_KEYS.sound, false)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(STORAGE_KEYS.history, [])
  const [historyEnabled, setHistoryEnabled] = useLocalStorage<boolean>(
    STORAGE_KEYS.historyEnabled,
    true,
  )

  const [activeTab, setActiveTab] = useState<GeneratorTab>('password')
  const [activePreset, setActivePreset] = useState<PresetId>('')
  const [regenSeed, setRegenSeed] = useState(0)
  const [clearedVersion, setClearedVersion] = useState<string | null>(null)
  const [hidden, setHidden] = useState(true)
  const [pulsing, setPulsing] = useState(false)
  const [toast, setToast] = useState('')
  const [securityExpanded, setSecurityExpanded] = useState(false)
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => getColor())

  const clipboardSecurer = useClipboardSecurer(clipboardClearEnabled)

  const lengthMin = getLengthMin(activePreset === 'pin')
  const normalizedSettings = useMemo(
    () => normalizeSettings(settings, lengthMin),
    [settings, lengthMin],
  )

  const settingsVersion = useMemo(
    () => JSON.stringify({ normalizedSettings, passphraseSettings, activeTab, regenSeed }),
    [normalizedSettings, passphraseSettings, activeTab, regenSeed],
  )

  const errorMap: Record<string, Parameters<typeof t>[1]> = useMemo(
    () => ({
      noCharset: 'errorNoCharset',
      invalidLength: 'errorInvalidLength',
      invalidCount: 'errorInvalidCount',
      emptyPool: 'errorEmptyPool',
      lengthTooShort: 'errorLengthTooShort',
    }),
    [],
  )

  const passwordGeneration = useMemo(() => {
    void regenSeed
    const errorKey = validateSettings(normalizedSettings, lengthMin)
    if (errorKey) return { error: errorKey, list: [] as string[] }
    return { error: null, list: generatePasswords(normalizedSettings) }
  }, [normalizedSettings, lengthMin, regenSeed])

  const passphrase = useMemo(() => {
    void regenSeed
    return generatePassphrase(passphraseSettings)
  }, [passphraseSettings, regenSeed])

  const passwords =
    clearedVersion === settingsVersion ? [] : passwordGeneration.list

  const error = passwordGeneration.error
    ? t(lang, errorMap[passwordGeneration.error] ?? 'errorNoCharset')
    : null

  const currentValue = activeTab === 'password' ? passwords[0] ?? '' : passphrase

  const strength = useMemo(() => {
    if (activeTab === 'passphrase') {
      const entropy = getPassphraseEntropy(passphraseSettings)
      const score = entropy >= 80 ? 7 : entropy >= 60 ? 5 : entropy >= 40 ? 3 : 1
      return {
        label: score >= 7 ? 'veryStrong' : score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak',
        width: score >= 7 ? '100%' : score >= 5 ? '75%' : score >= 3 ? '50%' : '25%',
        color: score >= 7 ? '#22c55e' : score >= 5 ? '#84cc16' : score >= 3 ? '#eab308' : '#ef4444',
        tip: score >= 5 ? 'tipGood' : 'tipLength',
        score,
      }
    }
    return evaluateStrength(currentValue, normalizedSettings)
  }, [activeTab, currentValue, normalizedSettings, passphraseSettings])

  const securityMetrics = useMemo(() => {
    if (activeTab === 'passphrase') {
      const entropy = getPassphraseEntropy(passphraseSettings)
      return {
        charsetSize: 7776,
        entropyBits: entropy,
        combinations: `2^${entropy}`,
        crackTime: currentValue ? (entropy >= 60 ? (lang === 'pt' ? 'séculos' : 'centuries') : lang === 'pt' ? 'anos' : 'years') : '—',
      }
    }
    return computeSecurityMetrics(currentValue, normalizedSettings, lang)
  }, [activeTab, currentValue, normalizedSettings, passphraseSettings, lang])

  const triggerRegenerate = useCallback(
    (trackHistory = false) => {
      setRegenSeed((s) => s + 1)
      setClearedVersion(null)
      setPulsing(true)
      window.setTimeout(() => setPulsing(false), 400)
      if (soundEnabled) playRegenerateSound()

      if (trackHistory && historyEnabled && activeTab === 'password') {
        const next = generatePasswords(normalizedSettings)
        if (next[0]) {
          setHistory((prev) => {
            const entry: HistoryEntry = {
              id: crypto.randomUUID(),
              value: next[0],
              timestamp: Date.now(),
              type: 'password',
            }
            return [entry, ...prev.filter((h) => h.value !== next[0])].slice(0, HISTORY_MAX)
          })
        }
      }
    },
    [activeTab, normalizedSettings, soundEnabled, historyEnabled, setHistory],
  )

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }, [])

  const handleCopy = useCallback(
    async (text: string) => {
      if (!text) return
      try {
        if (clipboardClearEnabled) {
          await clipboardSecurer.copy(text)
        } else {
          await navigator.clipboard.writeText(text)
        }
        if (soundEnabled) playCopySound()
        showToast(t(lang, 'copied'))
      } catch {
        showToast('Copy failed')
      }
    },
    [clipboardClearEnabled, clipboardSecurer, soundEnabled, showToast, lang],
  )

  const applyPreset = useCallback(
    (preset: PresetId) => {
      setActivePreset(preset)
      if (preset === 'pin') {
        setSettings({
          length: 6,
          count: 1,
          upper: false,
          lower: false,
          number: true,
          symbol: false,
          avoidSimilar: false,
        })
      } else if (preset === 'readable') {
        setSettings({
          length: 18,
          count: 1,
          upper: true,
          lower: true,
          number: true,
          symbol: false,
          avoidSimilar: true,
        })
      } else if (preset === 'secure') {
        setSettings({
          length: 24,
          count: 3,
          upper: true,
          lower: true,
          number: true,
          symbol: true,
          avoidSimilar: false,
        })
      }
    },
    [setSettings],
  )

  const updateSettings = useCallback(
    (patch: Partial<PasswordSettings>) => {
      setActivePreset('')
      setSettings((prev) => normalizeSettings({ ...prev, ...patch }, lengthMin))
    },
    [setSettings, lengthMin],
  )

  const handleThemeToggle = () => {
    toggleMode()
    setThemeTick((n) => n + 1)
  }

  const handleColorTheme = (color: ColorTheme) => {
    setColorTheme(color)
    setColorThemeState(color)
  }

  const isDark = themeTick >= 0 && getMode() === 'dark'

  const profileKey = getProfileKey(normalizedSettings)
  const profileLabels: Record<string, Parameters<typeof t>[1]> = {
    pin: 'profilePin',
    readable: 'profileReadable',
    fortified: 'profileFortified',
    balancedPlus: 'profileBalancedPlus',
    balanced: 'profileBalanced',
  }
  const profileLabel = t(lang, profileLabels[profileKey] ?? 'profileBalanced')
  const typeCount = [normalizedSettings.lower, normalizedSettings.upper, normalizedSettings.number, normalizedSettings.symbol].filter(Boolean).length

  const lengthHint =
    normalizedSettings.length >= 16 ? t(lang, 'lengthHintGreat') : t(lang, 'lengthHint')

  const downloadPasswords = () => {
    if (!passwords.length) return
    const blob = new Blob([passwords.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'purepass-passwords.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        triggerRegenerate(true)
      }
      if (e.key === 'c' || e.key === 'C') {
        if (e.ctrlKey || e.metaKey) return
        e.preventDefault()
        handleCopy(currentValue)
      }
      if (e.key === 'Escape') setHidden(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [triggerRegenerate, handleCopy, currentValue])

  return (
    <div className="app-shell">
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="ambient-orb ambient-orb--3" />
        <div className="ambient-grain" />
      </div>

      <div className="app-layout">
        <HeroPanel lang={lang} />

        <div className="app-main">
          <Header lang={lang} onLangChange={setLang} onToggleTheme={handleThemeToggle} isDark={isDark} />
          <ThemeBar lang={lang} active={colorTheme} onChange={handleColorTheme} />

          <main className="main-card">
            <TabBar lang={lang} active={activeTab} onChange={setActiveTab} />

            <StatusStrip
              lang={lang}
              profile={activeTab === 'passphrase' ? 'Passphrase' : profileLabel}
              typeCount={activeTab === 'passphrase' ? passphraseSettings.wordCount : typeCount}
              outputCount={activeTab === 'passphrase' ? 1 : normalizedSettings.count}
            />

            <Toast message={toast} />

            <ResultDisplay
              lang={lang}
              value={currentValue}
              hidden={hidden}
              pulsing={pulsing}
              placeholder={activeTab === 'passphrase' ? t(lang, 'passphrasePlaceholder') : t(lang, 'placeholder')}
              onToggleHidden={() => setHidden((h) => !h)}
              onCopy={() => handleCopy(currentValue)}
              onRegenerate={() => triggerRegenerate(true)}
            />

            <ClipboardSecurer
              lang={lang}
              active={clipboardSecurer.active}
              remaining={clipboardSecurer.remaining}
              progress={clipboardSecurer.progress}
            />

            <StrengthMeter
              lang={lang}
              label={strength.label}
              width={strength.width}
              color={strength.color}
              tip={strength.tip}
              charCount={currentValue.length}
            />

            <SecurityDetails
              lang={lang}
              entropy={securityMetrics.entropyBits}
              charsetSize={securityMetrics.charsetSize}
              combinations={securityMetrics.combinations}
              crackTime={securityMetrics.crackTime}
              expanded={securityExpanded}
              onToggle={() => setSecurityExpanded((e) => !e)}
            />

            {error && <p className="error-message">{error}</p>}

            {activeTab === 'password' ? (
              <ConfigPanel
                lang={lang}
                settings={normalizedSettings}
                lengthMin={lengthMin}
                activePreset={activePreset}
                clipboardClearEnabled={clipboardClearEnabled}
                soundEnabled={soundEnabled}
                lengthHint={lengthHint}
                onSettingsChange={updateSettings}
                onPreset={applyPreset}
                onClipboardClearToggle={setClipboardClearEnabled}
                onSoundToggle={setSoundEnabled}
              />
            ) : (
              <PassphraseConfig
                lang={lang}
                wordCount={passphraseSettings.wordCount}
                separator={passphraseSettings.separator}
                capitalize={passphraseSettings.capitalize}
                includeNumber={passphraseSettings.includeNumber}
                onWordCountChange={(n) =>
                  setPassphraseSettings((p) => ({ ...p, wordCount: clamp(n, 3, 8) }))
                }
                onSeparatorChange={(s) => setPassphraseSettings((p) => ({ ...p, separator: s || '-' }))}
                onCapitalizeChange={(v) => setPassphraseSettings((p) => ({ ...p, capitalize: v }))}
                onIncludeNumberChange={(v) => setPassphraseSettings((p) => ({ ...p, includeNumber: v }))}
              />
            )}

            {activeTab === 'password' && (
              <BatchList
                lang={lang}
                passwords={passwords}
                onCopy={handleCopy}
                onCopyAll={() => handleCopy(passwords.join('\n'))}
                onDownload={downloadPasswords}
                onClear={() => setClearedVersion(settingsVersion)}
              />
            )}

            <HistoryPanel
              lang={lang}
              entries={history}
              historyEnabled={historyEnabled}
              onCopy={handleCopy}
              onClear={() => setHistory([])}
              onRemove={(id) => setHistory((prev) => prev.filter((e) => e.id !== id))}
              onHistoryEnabledChange={setHistoryEnabled}
            />
          </main>

          <Footer lang={lang} />
        </div>
      </div>
    </div>
  )
}

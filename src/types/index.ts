export type Language = 'pt' | 'en'

export type ColorTheme = 'carbon' | 'nordic' | 'cyber' | 'forest' | 'warm'

export type ThemeMode = 'light' | 'dark'

export type PresetId = 'readable' | 'secure' | 'pin' | ''

export type GeneratorTab = 'password' | 'passphrase'

export interface PasswordSettings {
  length: number
  count: number
  upper: boolean
  lower: boolean
  number: boolean
  symbol: boolean
  avoidSimilar: boolean
}

export interface PassphraseSettings {
  wordCount: number
  separator: string
  capitalize: boolean
  includeNumber: boolean
}

export interface StrengthResult {
  label: string
  width: string
  color: string
  tip: string
  score: number
}

export interface SecurityMetrics {
  charsetSize: number
  entropyBits: number
  combinations: string
  crackTime: string
}

export interface HistoryEntry {
  id: string
  value: string
  timestamp: number
  type: GeneratorTab
}

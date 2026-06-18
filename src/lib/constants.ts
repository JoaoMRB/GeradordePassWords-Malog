export const STORAGE_KEYS = {
  settings: 'purepass-settings',
  theme: 'purepass-theme',
  colorTheme: 'purepass-color-theme',
  language: 'purepass-language',
  clipboardClear: 'purepass-clipboard-clear',
  sound: 'purepass-sound',
  history: 'purepass-history',
  historyEnabled: 'purepass-history-enabled',
} as const

export const LENGTH_MIN = 8
export const LENGTH_MAX = 64
export const LENGTH_MIN_PIN = 4
export const COUNT_MIN = 1
export const COUNT_MAX = 10
export const CLIPBOARD_CLEAR_SECONDS = 30
export const HISTORY_MAX = 20

export const CHAR_SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '!@#$%^&*()[]{}=<>?/.,_-+',
} as const

export const SIMILAR_CHARS = new Set(['O', '0', 'I', 'l', '1', '|'])

export const COLOR_THEMES = [
  'carbon',
  'nordic',
  'cyber',
  'forest',
  'warm',
] as const

export const DEFAULT_PASSWORD_SETTINGS = {
  length: 16,
  count: 1,
  upper: true,
  lower: true,
  number: true,
  symbol: true,
  avoidSimilar: false,
}

export const DEFAULT_PASSPHRASE_SETTINGS = {
  wordCount: 4,
  separator: '-',
  capitalize: true,
  includeNumber: true,
}

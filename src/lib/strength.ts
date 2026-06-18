import type { PasswordSettings, SecurityMetrics } from '../types'
import { getCharsetSize } from './password'

function hasSequentialPattern(password: string): boolean {
  const normalized = password.toLowerCase()
  const sequences = [
    '0123456789',
    '9876543210',
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
  ]
  return sequences.some((sequence) => {
    for (let i = 0; i <= sequence.length - 4; i += 1) {
      if (normalized.includes(sequence.slice(i, i + 4))) return true
    }
    return false
  })
}

export function evaluateStrength(password: string, settings: PasswordSettings) {
  if (!password) {
    return {
      label: 'none',
      width: '0%',
      color: 'transparent',
      tip: 'tipGenerate',
      score: 0,
    }
  }

  let score = 0
  const selectedTypes = [settings.lower, settings.upper, settings.number, settings.symbol].filter(
    Boolean,
  ).length

  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (password.length >= 24) score += 1
  if (selectedTypes >= 3) score += 1
  if (selectedTypes === 4) score += 1
  if (!hasSequentialPattern(password)) score += 1
  if (new Set(password).size >= Math.min(password.length, 10)) score += 1

  if (password.length < 10) score = Math.min(score, 1)

  const tips: string[] = []
  if (password.length < 16) tips.push('tipLength')
  if (selectedTypes < 3) tips.push('tipTypes')
  if (hasSequentialPattern(password)) tips.push('tipSequence')
  if (!tips.length) tips.push('tipGood')

  let label = 'veryStrong'
  let width = '100%'
  let color = '#22c55e'

  if (score <= 2) {
    label = 'weak'
    width = '25%'
    color = '#ef4444'
  } else if (score <= 4) {
    label = 'medium'
    width = '50%'
    color = '#eab308'
  } else if (score <= 6) {
    label = 'strong'
    width = '75%'
    color = '#84cc16'
  }

  return { label, width, color, tip: tips.join('|'), score }
}

function formatLargeNumber(n: number): string {
  if (n >= 1e18) return `${(n / 1e18).toFixed(1)}×10¹⁸`
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)}×10¹⁵`
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}×10¹²`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}×10⁹`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toFixed(0)
}

function formatCrackTime(seconds: number, lang: 'pt' | 'en'): string {
  const units: [string, number][] =
    lang === 'pt'
      ? [
          ['séculos', 60 * 60 * 24 * 365.25 * 100],
          ['anos', 60 * 60 * 24 * 365.25],
          ['meses', 60 * 60 * 24 * 30],
          ['dias', 60 * 60 * 24],
          ['horas', 60 * 60],
          ['minutos', 60],
          ['segundos', 1],
        ]
      : [
          ['centuries', 60 * 60 * 24 * 365.25 * 100],
          ['years', 60 * 60 * 24 * 365.25],
          ['months', 60 * 60 * 24 * 30],
          ['days', 60 * 60 * 24],
          ['hours', 60 * 60],
          ['minutes', 60],
          ['seconds', 1],
        ]

  for (const [label, unitSeconds] of units) {
    if (seconds >= unitSeconds) {
      const value = seconds / unitSeconds
      const formatted = value >= 100 ? Math.round(value).toString() : value.toFixed(1)
      return `${formatted} ${label}`
    }
  }
  return lang === 'pt' ? 'instantâneo' : 'instant'
}

export function computeSecurityMetrics(
  password: string,
  settings: PasswordSettings,
  lang: 'pt' | 'en',
): SecurityMetrics {
  const charsetSize = getCharsetSize(settings)
  const length = password.length || settings.length
  const entropyBits = charsetSize > 0 ? Math.round(length * Math.log2(charsetSize)) : 0

  let combinations = '—'
  if (charsetSize > 0 && length <= 40) {
    combinations = formatLargeNumber(Math.pow(charsetSize, length))
  } else if (charsetSize > 0) {
    combinations = `2^${entropyBits}`
  }

  const guessesPerSecond = 1e10
  const crackSeconds = charsetSize > 0 ? Math.pow(charsetSize, length) / (2 * guessesPerSecond) : 0
  const crackTime = password ? formatCrackTime(crackSeconds, lang) : '—'

  return { charsetSize, entropyBits, combinations, crackTime }
}

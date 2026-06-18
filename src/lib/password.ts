import {
  CHAR_SETS,
  COUNT_MAX,
  COUNT_MIN,
  LENGTH_MAX,
  SIMILAR_CHARS,
} from './constants'
import type { PasswordSettings } from '../types'

export const DEFAULT_LENGTH_MIN = 8

function secureRandomIndex(max: number): number {
  if (max <= 0) return 0
  const values = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  do {
    crypto.getRandomValues(values)
  } while (values[0] >= limit)
  return values[0] % max
}

function randomCharFrom(pool: string): string {
  return pool[secureRandomIndex(pool.length)]
}

function shuffle<T>(array: T[]): T[] {
  const cloned = [...array]
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = secureRandomIndex(i + 1)
    ;[cloned[i], cloned[j]] = [cloned[j], cloned[i]]
  }
  return cloned
}

function sanitizePool(pool: string, avoidSimilar: boolean): string {
  if (!avoidSimilar) return pool
  return [...pool].filter((char) => !SIMILAR_CHARS.has(char)).join('')
}

function buildPools(settings: PasswordSettings) {
  return [
    settings.lower && { key: 'lower', pool: sanitizePool(CHAR_SETS.lower, settings.avoidSimilar) },
    settings.upper && { key: 'upper', pool: sanitizePool(CHAR_SETS.upper, settings.avoidSimilar) },
    settings.number && { key: 'number', pool: sanitizePool(CHAR_SETS.number, settings.avoidSimilar) },
    settings.symbol && { key: 'symbol', pool: sanitizePool(CHAR_SETS.symbol, settings.avoidSimilar) },
  ]
    .filter(Boolean)
    .filter((entry) => entry && entry.pool.length > 0) as { key: string; pool: string }[]
}

export function getLengthMin(isPin: boolean): number {
  return isPin ? 4 : DEFAULT_LENGTH_MIN
}

export function validateSettings(
  settings: PasswordSettings,
  lengthMin = DEFAULT_LENGTH_MIN,
): string | null {
  if (!settings.upper && !settings.lower && !settings.number && !settings.symbol) {
    return 'noCharset'
  }
  if (settings.length < lengthMin || settings.length > LENGTH_MAX) {
    return 'invalidLength'
  }
  if (settings.count < COUNT_MIN || settings.count > COUNT_MAX) {
    return 'invalidCount'
  }
  const pools = buildPools(settings)
  if (pools.length === 0) return 'emptyPool'
  if (settings.length < pools.length) return 'lengthTooShort'
  return null
}

export function generatePassword(settings: PasswordSettings): string {
  const pools = buildPools(settings)
  const guaranteedChars = pools.map((entry) => randomCharFrom(entry.pool))
  const mergedPool = pools.map((entry) => entry.pool).join('')
  const chars = [...guaranteedChars]
  while (chars.length < settings.length) {
    chars.push(randomCharFrom(mergedPool))
  }
  return shuffle(chars).join('')
}

export function generatePasswords(settings: PasswordSettings): string[] {
  return Array.from({ length: settings.count }, () => generatePassword(settings))
}

export function getCharsetSize(settings: PasswordSettings): number {
  return buildPools(settings).reduce((sum, entry) => sum + entry.pool.length, 0)
}

export function getProfileKey(settings: PasswordSettings): string {
  if (settings.number && !settings.upper && !settings.lower && !settings.symbol) {
    return 'pin'
  }
  if (settings.avoidSimilar && !settings.symbol) return 'readable'
  if (
    settings.length >= 24 &&
    settings.upper &&
    settings.lower &&
    settings.number &&
    settings.symbol
  ) {
    return 'fortified'
  }
  if (settings.length >= 16) return 'balancedPlus'
  return 'balanced'
}

export function getCharType(char: string): 'upper' | 'lower' | 'number' | 'symbol' | 'other' {
  if (CHAR_SETS.upper.includes(char)) return 'upper'
  if (CHAR_SETS.lower.includes(char)) return 'lower'
  if (CHAR_SETS.number.includes(char)) return 'number'
  if (CHAR_SETS.symbol.includes(char)) return 'symbol'
  return 'other'
}

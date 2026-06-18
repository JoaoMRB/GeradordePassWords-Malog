import type { PassphraseSettings } from '../types'

const WORDS = [
  'apple', 'river', 'cloud', 'stone', 'flame', 'ocean', 'maple', 'tiger',
  'brave', 'coral', 'delta', 'eagle', 'frost', 'ghost', 'honey', 'ivory',
  'jade', 'karma', 'lemon', 'mint', 'noble', 'olive', 'pearl', 'quest',
  'rust', 'solar', 'terra', 'ultra', 'vivid', 'whale', 'xenon', 'yacht',
  'zebra', 'amber', 'blaze', 'cedar', 'dawn', 'ember', 'fern', 'grove',
  'haven', 'inlet', 'jewel', 'knoll', 'lunar', 'meadow', 'north', 'orbit',
  'prism', 'quartz', 'ridge', 'spark', 'tidal', 'umber', 'vault', 'winds',
  'yonder', 'zenith', 'anchor', 'breeze', 'canyon', 'drift', 'echo', 'fjord',
  'glade', 'harbor', 'island', 'jungle', 'kernel', 'lagoon', 'marble', 'nebula',
  'onyx', 'plasma', 'quiver', 'ripple', 'summit', 'thunder', 'uplift', 'vertex',
  'willow', 'xylem', 'yarrow', 'zodiac', 'arcade', 'beacon', 'cipher', 'dynamo',
  'enigma', 'fusion', 'galaxy', 'horizon', 'ignite', 'jigsaw', 'kinetic', 'legacy',
  'matrix', 'nexus', 'oracle', 'phantom', 'quantum', 'radial', 'signal', 'tangent',
  'unicorn', 'vector', 'wavelength', 'xenial', 'yield', 'zephyr', 'atlas', 'binary',
  'cosmos', 'domain', 'entropy', 'flux', 'glyph', 'helix', 'index', 'jovial',
  'keystone', 'lambda', 'module', 'node', 'optics', 'pixel', 'query', 'relay',
  'syntax', 'token', 'unity', 'vertex', 'widget', 'xenith', 'yonder', 'zero',
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'sigma', 'omega', 'prime',
  'crystal', 'diamond', 'emerald', 'granite', 'obsidian', 'sapphire', 'topaz', 'basalt',
  'aurora', 'comet', 'meteor', 'nova', 'pulsar', 'quasar', 'stellar', 'cosmic',
  'falcon', 'panther', 'wolf', 'lynx', 'otter', 'raven', 'sparrow', 'badger',
  'cobalt', 'copper', 'silver', 'bronze', 'chrome', 'nickel', 'titanium', 'steel',
  'bamboo', 'cypress', 'sequoia', 'spruce', 'birch', 'aspen', 'redwood', 'juniper',
  'cascade', 'torrent', 'stream', 'spring', 'glacier', 'volcano', 'crater', 'plateau',
  'compass', 'beacon', 'lantern', 'mirror', 'portal', 'shield', 'sword', 'crown',
  'canvas', 'palette', 'sculpt', 'rhythm', 'melody', 'harmony', 'tempo', 'chord',
  'fabric', 'thread', 'weave', 'stitch', 'pattern', 'texture', 'gradient', 'shadow',
  'cipher', 'vault', 'lock', 'key', 'guard', 'sentinel', 'fortress', 'bastion',
  'pure', 'secure', 'random', 'secret', 'hidden', 'silent', 'swift', 'solid',
]

function secureRandomIndex(max: number): number {
  const values = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  do {
    crypto.getRandomValues(values)
  } while (values[0] >= limit)
  return values[0] % max
}

function pickWord(): string {
  return WORDS[secureRandomIndex(WORDS.length)]
}

export function generatePassphrase(settings: PassphraseSettings): string {
  const words = Array.from({ length: settings.wordCount }, () => {
    let word = pickWord()
    if (settings.capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word
  })

  if (settings.includeNumber) {
    const num = secureRandomIndex(100)
    words.push(String(num))
  }

  return words.join(settings.separator)
}

export function getPassphraseEntropy(settings: PassphraseSettings): number {
  const bitsPerWord = Math.log2(WORDS.length)
  const totalWords = settings.wordCount + (settings.includeNumber ? 1 : 0)
  return Math.round(totalWords * bitsPerWord)
}

export const PASSPHRASE_WORD_COUNT = WORDS.length

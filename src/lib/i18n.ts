import type { Language } from '../types'

type TranslationKeys =
  | 'appName'
  | 'appTagline'
  | 'heroTitle'
  | 'heroSubtitle'
  | 'heroFeature1'
  | 'heroFeature2'
  | 'heroFeature3'
  | 'heroFeature4'
  | 'tabPassword'
  | 'tabPassphrase'
  | 'regenerate'
  | 'copy'
  | 'copied'
  | 'copyAll'
  | 'download'
  | 'clear'
  | 'show'
  | 'hide'
  | 'strength'
  | 'characters'
  | 'presets'
  | 'presetReadable'
  | 'presetSecure'
  | 'presetPin'
  | 'length'
  | 'lengthHint'
  | 'lengthHintGreat'
  | 'quantity'
  | 'passwords'
  | 'charset'
  | 'uppercase'
  | 'uppercaseDesc'
  | 'lowercase'
  | 'lowercaseDesc'
  | 'numbers'
  | 'numbersDesc'
  | 'symbols'
  | 'symbolsDesc'
  | 'avoidSimilar'
  | 'avoidSimilarDesc'
  | 'clipboardClear'
  | 'clipboardClearDesc'
  | 'clipboardClearing'
  | 'clipboardCleared'
  | 'securityDetails'
  | 'entropy'
  | 'charsetSize'
  | 'combinations'
  | 'crackTime'
  | 'batchResults'
  | 'batchEmpty'
  | 'history'
  | 'historyEmpty'
  | 'clearHistory'
  | 'saveHistory'
  | 'saveHistoryDesc'
  | 'saveHistoryOn'
  | 'saveHistoryOff'
  | 'deleteEntry'
  | 'historyDisabledHint'
  | 'profile'
  | 'complexity'
  | 'output'
  | 'types'
  | 'sound'
  | 'soundOn'
  | 'soundOff'
  | 'theme'
  | 'footerSecurity'
  | 'footerCreditPrefix'
  | 'placeholder'
  | 'passphrasePlaceholder'
  | 'wordCount'
  | 'separator'
  | 'capitalize'
  | 'includeNumber'
  | 'passphraseTip'
  | 'keyboardHint'
  | 'errorNoCharset'
  | 'errorInvalidLength'
  | 'errorInvalidCount'
  | 'errorEmptyPool'
  | 'errorLengthTooShort'
  | 'strengthNone'
  | 'strengthWeak'
  | 'strengthMedium'
  | 'strengthStrong'
  | 'strengthVeryStrong'
  | 'tipGenerate'
  | 'tipLength'
  | 'tipTypes'
  | 'tipSequence'
  | 'tipGood'
  | 'profilePin'
  | 'profileReadable'
  | 'profileFortified'
  | 'profileBalancedPlus'
  | 'profileBalanced'
  | 'shortLength'
  | 'balancedLength'
  | 'maxLength'

const translations: Record<Language, Record<TranslationKeys, string>> = {
  pt: {
    appName: 'PurePass',
    appTagline: 'Seguro · Instantâneo · Local',
    heroTitle: 'Palavras-passe que protegem de verdade',
    heroSubtitle:
      'Geração criptográfica no teu browser. Zero servidores, zero rastreio — só segurança pura.',
    heroFeature1: 'Web Crypto API nativa',
    heroFeature2: 'Limpeza automática do clipboard',
    heroFeature3: 'Modo passphrase estilo Diceware',
    heroFeature4: '100% offline após carregar',
    tabPassword: 'Password',
    tabPassphrase: 'Passphrase',
    regenerate: 'Regenerar',
    copy: 'Copiar',
    copied: 'Copiado!',
    copyAll: 'Copiar tudo',
    download: 'Exportar',
    clear: 'Limpar',
    show: 'Mostrar',
    hide: 'Ocultar',
    strength: 'Força',
    characters: 'caracteres',
    presets: 'Presets',
    presetReadable: 'Legível',
    presetSecure: 'Blindada',
    presetPin: 'PIN',
    length: 'Comprimento',
    lengthHint: 'Entre 8 e 64 caracteres para equilibrar segurança e usabilidade.',
    lengthHintGreat: 'Zona ideal para contas importantes.',
    quantity: 'Quantidade',
    passwords: 'passwords',
    charset: 'Caracteres',
    uppercase: 'Maiúsculas',
    uppercaseDesc: 'A–Z',
    lowercase: 'Minúsculas',
    lowercaseDesc: 'a–z',
    numbers: 'Números',
    numbersDesc: '0–9',
    symbols: 'Símbolos',
    symbolsDesc: '!@#$…',
    avoidSimilar: 'Evitar parecidos',
    avoidSimilarDesc: 'O, 0, I, l, 1',
    clipboardClear: 'Limpar clipboard',
    clipboardClearDesc: 'Apaga após 30s de copiar',
    clipboardClearing: 'Clipboard limpa em {s}s',
    clipboardCleared: 'Clipboard limpa por segurança',
    securityDetails: 'Análise de segurança',
    entropy: 'Entropia',
    charsetSize: 'Charset',
    combinations: 'Combinações',
    crackTime: 'Tempo p/ quebrar',
    batchResults: 'Resultados',
    batchEmpty: 'Gera uma ou várias passwords para veres aqui.',
    history: 'Histórico local',
    historyEmpty: 'Sem histórico ainda.',
    clearHistory: 'Limpar tudo',
    saveHistory: 'Guardar histórico',
    saveHistoryDesc: 'Regista passwords geradas localmente',
    saveHistoryOn: 'Ativo',
    saveHistoryOff: 'Desativado',
    deleteEntry: 'Apagar entrada',
    historyDisabledHint: 'O histórico não está a ser guardado.',
    profile: 'Perfil',
    complexity: 'Complexidade',
    output: 'Saída',
    types: 'tipos',
    sound: 'Som',
    soundOn: 'Ativado',
    soundOff: 'Desativado',
    theme: 'Tema',
    footerSecurity:
      'Tudo corre localmente no teu dispositivo via Web Crypto API. Nenhum dado é enviado a servidores.',
    footerCreditPrefix: 'PurePass · Open Source ·',
    placeholder: 'A tua password aparece aqui…',
    passphrasePlaceholder: 'A tua passphrase aparece aqui…',
    wordCount: 'Palavras',
    separator: 'Separador',
    capitalize: 'Capitalizar',
    includeNumber: 'Incluir número',
    passphraseTip: 'Passphrases longas são mais fáceis de memorizar e difíceis de quebrar.',
    keyboardHint: 'R regenerar · C copiar · Esc ocultar',
    errorNoCharset: 'Seleciona pelo menos um tipo de caractere.',
    errorInvalidLength: 'Comprimento inválido.',
    errorInvalidCount: 'Quantidade inválida.',
    errorEmptyPool: 'As opções removeram todos os caracteres.',
    errorLengthTooShort: 'Comprimento insuficiente para os tipos selecionados.',
    strengthNone: 'Sem avaliar',
    strengthWeak: 'Fraca',
    strengthMedium: 'Média',
    strengthStrong: 'Forte',
    strengthVeryStrong: 'Muito forte',
    tipGenerate: 'Gera uma password para ver sugestões.',
    tipLength: 'Aumenta para 16+ caracteres.',
    tipTypes: 'Mistura mais tipos de caracteres.',
    tipSequence: 'Evita sequências como 1234 ou abcd.',
    tipGood: 'Excelente combinação. Mantém-na única e ativa 2FA.',
    profilePin: 'PIN',
    profileReadable: 'Legível',
    profileFortified: 'Blindado',
    profileBalancedPlus: 'Equilibrado+',
    profileBalanced: 'Equilibrado',
    shortLength: 'Curta',
    balancedLength: 'Equilibrada',
    maxLength: 'Máxima',
  },
  en: {
    appName: 'PurePass',
    appTagline: 'Secure · Instant · Local',
    heroTitle: 'Passwords that actually protect you',
    heroSubtitle:
      'Cryptographic generation in your browser. Zero servers, zero tracking — pure security.',
    heroFeature1: 'Native Web Crypto API',
    heroFeature2: 'Auto clipboard clearing',
    heroFeature3: 'Diceware-style passphrase mode',
    heroFeature4: '100% offline after load',
    tabPassword: 'Password',
    tabPassphrase: 'Passphrase',
    regenerate: 'Regenerate',
    copy: 'Copy',
    copied: 'Copied!',
    copyAll: 'Copy all',
    download: 'Export',
    clear: 'Clear',
    show: 'Show',
    hide: 'Hide',
    strength: 'Strength',
    characters: 'characters',
    presets: 'Presets',
    presetReadable: 'Readable',
    presetSecure: 'Fortified',
    presetPin: 'PIN',
    length: 'Length',
    lengthHint: 'Between 8 and 64 characters to balance security and usability.',
    lengthHintGreat: 'Ideal zone for important accounts.',
    quantity: 'Quantity',
    passwords: 'passwords',
    charset: 'Characters',
    uppercase: 'Uppercase',
    uppercaseDesc: 'A–Z',
    lowercase: 'Lowercase',
    lowercaseDesc: 'a–z',
    numbers: 'Numbers',
    numbersDesc: '0–9',
    symbols: 'Symbols',
    symbolsDesc: '!@#$…',
    avoidSimilar: 'Avoid similar',
    avoidSimilarDesc: 'O, 0, I, l, 1',
    clipboardClear: 'Clear clipboard',
    clipboardClearDesc: 'Wipes after 30s of copying',
    clipboardClearing: 'Clipboard clears in {s}s',
    clipboardCleared: 'Clipboard cleared for security',
    securityDetails: 'Security analysis',
    entropy: 'Entropy',
    charsetSize: 'Charset',
    combinations: 'Combinations',
    crackTime: 'Crack time',
    batchResults: 'Results',
    batchEmpty: 'Generate one or more passwords to see them here.',
    history: 'Local history',
    historyEmpty: 'No history yet.',
    clearHistory: 'Clear all',
    saveHistory: 'Save history',
    saveHistoryDesc: 'Stores generated passwords locally',
    saveHistoryOn: 'On',
    saveHistoryOff: 'Off',
    deleteEntry: 'Delete entry',
    historyDisabledHint: 'History is not being saved.',
    profile: 'Profile',
    complexity: 'Complexity',
    output: 'Output',
    types: 'types',
    sound: 'Sound',
    soundOn: 'On',
    soundOff: 'Off',
    theme: 'Theme',
    footerSecurity:
      'Everything runs locally on your device via Web Crypto API. No data is sent to servers.',
    footerCreditPrefix: 'PurePass · Open Source ·',
    placeholder: 'Your password appears here…',
    passphrasePlaceholder: 'Your passphrase appears here…',
    wordCount: 'Words',
    separator: 'Separator',
    capitalize: 'Capitalize',
    includeNumber: 'Include number',
    passphraseTip: 'Long passphrases are easier to remember and harder to crack.',
    keyboardHint: 'R regenerate · C copy · Esc hide',
    errorNoCharset: 'Select at least one character type.',
    errorInvalidLength: 'Invalid length.',
    errorInvalidCount: 'Invalid quantity.',
    errorEmptyPool: 'Current options removed all available characters.',
    errorLengthTooShort: 'Length too short for selected types.',
    strengthNone: 'Not rated',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very strong',
    tipGenerate: 'Generate a password to see suggestions.',
    tipLength: 'Increase to 16+ characters.',
    tipTypes: 'Mix more character types.',
    tipSequence: 'Avoid sequences like 1234 or abcd.',
    tipGood: 'Great combination. Keep it unique and enable 2FA.',
    profilePin: 'PIN',
    profileReadable: 'Readable',
    profileFortified: 'Fortified',
    profileBalancedPlus: 'Balanced+',
    profileBalanced: 'Balanced',
    shortLength: 'Short',
    balancedLength: 'Balanced',
    maxLength: 'Maximum',
  },
}

export function t(lang: Language, key: TranslationKeys, vars?: Record<string, string | number>): string {
  let text = translations[lang][key] ?? key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}

export function detectLanguage(): Language {
  const stored = localStorage.getItem('purepass-language')
  if (stored === 'pt' || stored === 'en') return stored
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('pt') ? 'pt' : 'en'
}

export type { TranslationKeys }

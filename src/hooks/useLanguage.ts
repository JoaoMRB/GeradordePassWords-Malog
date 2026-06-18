import { useCallback, useState } from 'react'
import type { Language } from '../types'
import { detectLanguage } from '../lib/i18n'
import { STORAGE_KEYS } from '../lib/constants'

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      return detectLanguage()
    } catch {
      return 'en'
    }
  })

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEYS.language, next)
    document.documentElement.lang = next === 'pt' ? 'pt-PT' : 'en'
  }, [])

  return { lang, setLang }
}

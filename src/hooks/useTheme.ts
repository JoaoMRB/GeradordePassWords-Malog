import { useCallback, useEffect } from 'react'
import type { ColorTheme, ThemeMode } from '../types'
import { STORAGE_KEYS } from '../lib/constants'

export function useTheme() {
  const getStored = (): { mode: ThemeMode; color: ColorTheme } => ({
    mode: (localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode) || 'dark',
    color: (localStorage.getItem(STORAGE_KEYS.colorTheme) as ColorTheme) || 'carbon',
  })

  const apply = useCallback((mode: ThemeMode, color: ColorTheme) => {
    document.documentElement.setAttribute('data-theme', mode)
    document.documentElement.setAttribute('data-color-theme', color)
    localStorage.setItem(STORAGE_KEYS.theme, mode)
    localStorage.setItem(STORAGE_KEYS.colorTheme, color)
  }, [])

  useEffect(() => {
    const { mode, color } = getStored()
    apply(mode, color)
  }, [apply])

  const toggleMode = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme') as ThemeMode
    const color = document.documentElement.getAttribute('data-color-theme') as ColorTheme
    apply(current === 'dark' ? 'light' : 'dark', color)
  }, [apply])

  const setColorTheme = useCallback(
    (color: ColorTheme) => {
      const mode = document.documentElement.getAttribute('data-theme') as ThemeMode
      apply(mode, color)
    },
    [apply],
  )

  const getMode = (): ThemeMode =>
    (document.documentElement.getAttribute('data-theme') as ThemeMode) || 'dark'

  const getColor = (): ColorTheme =>
    (document.documentElement.getAttribute('data-color-theme') as ColorTheme) || 'carbon'

  return { toggleMode, setColorTheme, getMode, getColor }
}

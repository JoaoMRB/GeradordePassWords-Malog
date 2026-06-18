import { useCallback, useEffect, useRef, useState } from 'react'
import { CLIPBOARD_CLEAR_SECONDS } from '../lib/constants'

export function useClipboardSecurer(enabled: boolean) {
  const [remaining, setRemaining] = useState(0)
  const [active, setActive] = useState(false)
  const timerRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    timerRef.current = null
    intervalRef.current = null
  }, [])

  const wipeClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('\u200B')
    } catch {
      /* clipboard may be denied */
    }
  }, [])

  const startCountdown = useCallback(() => {
    if (!enabled) return
    clearTimers()
    setActive(true)
    setRemaining(CLIPBOARD_CLEAR_SECONDS)

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    timerRef.current = window.setTimeout(async () => {
      await wipeClipboard()
      setActive(false)
      setRemaining(0)
      clearTimers()
    }, CLIPBOARD_CLEAR_SECONDS * 1000)
  }, [enabled, clearTimers, wipeClipboard])

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text)
      startCountdown()
    },
    [startCountdown],
  )

  const cancel = useCallback(() => {
    clearTimers()
    setActive(false)
    setRemaining(0)
  }, [clearTimers])

  useEffect(() => () => clearTimers(), [clearTimers])

  const progress = active ? (remaining / CLIPBOARD_CLEAR_SECONDS) * 100 : 0

  return { copy, active, remaining, progress, cancel }
}

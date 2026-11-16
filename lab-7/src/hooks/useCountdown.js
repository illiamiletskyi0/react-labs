import { useEffect, useState } from 'react'

/**
 * Зворотний відлік від `totalSeconds` до нуля, по секунді.
 *
 * Використання:
 *   const { secondsLeft, isRunning, start, pause, reset } = useCountdown(180)
 *
 * Вимоги — у тестах tests/useCountdown.test.jsx.
 */
export function useCountdown(totalSeconds) {
  const [countdown, setCountdown] = useState({
    secondsLeft: totalSeconds,
    isRunning: false,
  })

  useEffect(() => {
    if (!countdown.isRunning) return

    const id = setInterval(() => {
      setCountdown((current) => {
        // На нулі відлік зупиняється сам, одним оновленням стану.
        if (current.secondsLeft <= 1) {
          return { secondsLeft: 0, isRunning: false }
        }
        return { ...current, secondsLeft: current.secondsLeft - 1 }
      })
    }, 1000)

    return () => clearInterval(id)
  }, [countdown.isRunning])

  return {
    secondsLeft: countdown.secondsLeft,
    isRunning: countdown.isRunning,
    start: () => setCountdown((current) => ({ ...current, isRunning: true })),
    pause: () => setCountdown((current) => ({ ...current, isRunning: false })),
    reset: () => setCountdown({ secondsLeft: totalSeconds, isRunning: false }),
  }
}

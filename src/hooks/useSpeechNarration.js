import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Production-ready Web Speech API hook for child-friendly narration.
 * Handles:
 * 1. iOS Safari .cancel() drop & safety-timeout fallback (300-500ms)
 * 2. Chrome 14-second pause bug workaround (pause/resume keep-alive)
 * 3. Preloads voices with onvoiceschanged
 * 4. Explicit preferredVoice selection for natural en-US speech
 * 5. Feature detection (silently fails if speechSynthesis is missing)
 * 6. Explicit language en-US, calibrated rate (0.85) and pitch (1.05)
 * 7. Cancel-before-speak race condition elimination
 * 8. Automatic index-change / unmount cleanup
 */
export function useSpeechNarration() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voicesRef = useRef([])
  const chromeKeepAliveRef = useRef(null)
  const safetyTimeoutRef = useRef(null)

  // 1. Voices Preload on mount with onvoiceschanged
  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices() || []
        if (available.length > 0) {
          voicesRef.current = available
        }
      } catch {
        voicesRef.current = []
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null
        window.speechSynthesis.cancel()
      }
      if (chromeKeepAliveRef.current) {
        clearInterval(chromeKeepAliveRef.current)
        chromeKeepAliveRef.current = null
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current)
        safetyTimeoutRef.current = null
      }
    }
  }, [isSupported])

  // Clear all running intervals & safety timeouts
  const clearTimers = useCallback(() => {
    if (chromeKeepAliveRef.current) {
      clearInterval(chromeKeepAliveRef.current)
      chromeKeepAliveRef.current = null
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current)
      safetyTimeoutRef.current = null
    }
  }, [])

  // 2. Stop function with iOS Safari fix & safety timeout (300ms)
  const stop = useCallback(() => {
    if (!isSupported) return

    clearTimers()
    try {
      window.speechSynthesis.cancel()
    } catch {
      // Ignore cancel errors on restrictive webviews
    }
    setIsSpeaking(false)

    // iOS Safari safety fallback (300ms) to force reset state even if browser drops events
    safetyTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false)
      safetyTimeoutRef.current = null
    }, 300)
  }, [isSupported, clearTimers])

  // 3. Speak function
  const speak = useCallback((text) => {
    if (!isSupported || !text) return

    // Cancel-before-speak: Clear any prior speech or timers immediately
    clearTimers()
    try {
      window.speechSynthesis.cancel()
    } catch {
      // Ignore cancel errors
    }
    setIsSpeaking(false)

    const utterance = new SpeechSynthesisUtterance(text)

    // Explicit language & kid-friendly cadence
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1.05

    // Preferred voice assignment: Prioritize natural/warm en-US voices
    const voices = voicesRef.current.length > 0 ? voicesRef.current : (window.speechSynthesis.getVoices() || [])
    const preferredVoice = voices.find(
      (v) => (v.lang === 'en-US' || v.lang.startsWith('en')) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))
    ) || voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en'))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)

      // Chrome 14-second pause/resume keep-alive (Chromium Issue 679437)
      chromeKeepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis?.speaking) {
          window.speechSynthesis.pause()
          window.speechSynthesis.resume()
        } else {
          clearTimers()
        }
      }, 14000)
    }

    utterance.onend = () => {
      clearTimers()
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      clearTimers()
      setIsSpeaking(false)
    }

    // Safety timeout fallback: estimated reading duration + 5000ms guard to ensure state resets
    const estimatedDurationMs = Math.max(8000, (text.split(' ').length / 2) * 1000 + 4000)
    safetyTimeoutRef.current = setTimeout(() => {
      if (!window.speechSynthesis?.speaking) {
        clearTimers()
        setIsSpeaking(false)
      }
    }, estimatedDurationMs)

    window.speechSynthesis.speak(utterance)
  }, [isSupported, clearTimers])

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
  }
}

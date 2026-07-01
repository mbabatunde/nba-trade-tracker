'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { ThemeProvider, BaseStyles } from '@primer/react'
import { StyledComponentsRegistry } from './styled-components-registry'

type ColorMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ColorMode
  toggle: () => void
  setMode: (mode: ColorMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Access + control the active light/dark color mode. */
export function useColorMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useColorMode must be used within <Providers>')
  return ctx
}

const STORAGE_KEY = 'nba-trade-tracker-color-mode'

/**
 * App-wide Primer providers with runtime light/dark switching. Primer resolves
 * color from two places that must always agree: the `data-color-mode` attribute
 * on <html> (which the @primer/primitives CSS keys off of) and `colorMode` on
 * ThemeProvider (which styled-components reads). We keep both in sync from a
 * single piece of state and persist the choice to localStorage.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>('dark')

  // Hydrate from the persisted / system preference on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ColorMode | null
    if (stored === 'light' || stored === 'dark') {
      setModeState(stored)
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setModeState(prefersDark ? 'dark' : 'light')
  }, [])

  // Mirror the mode onto <html> so the document background + primitives resolve.
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mode)
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const setMode = useCallback((next: ColorMode) => setModeState(next), [])
  const toggle = useCallback(() => setModeState((m) => (m === 'dark' ? 'light' : 'dark')), [])

  return (
    <StyledComponentsRegistry>
      <ThemeContext.Provider value={{ mode, toggle, setMode }}>
        <ThemeProvider
          colorMode={mode === 'dark' ? 'night' : 'day'}
          dayScheme="light"
          nightScheme="dark"
          preventSSRMismatch
        >
          <BaseStyles>{children}</BaseStyles>
        </ThemeProvider>
      </ThemeContext.Provider>
    </StyledComponentsRegistry>
  )
}

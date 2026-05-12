'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { getLocalStorage, setLocalStorage } from './webStorage'

export type ThemeMode = 'light' | 'dark'

type ThemeAction =
  | {
      type: 'set'
      mode: ThemeMode
    }
  | {
      type: 'toggle'
    }

type ThemeContextValue = {
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  toggleThemeMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function themeReducer(state: ThemeMode, action: ThemeAction): ThemeMode {
  if (action.type === 'set') return action.mode
  return state === 'light' ? 'dark' : 'light'
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

function persistTheme(mode: ThemeMode) {
  setLocalStorage('theme', mode)
  document.cookie = `theme=${mode}; path=/;`
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, dispatch] = useReducer(themeReducer, 'light')

  useEffect(() => {
    const localStorageTheme = getLocalStorage('theme')
    if (isThemeMode(localStorageTheme)) {
      dispatch({ type: 'set', mode: localStorageTheme })
    }
  }, [])

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (mode) => {
        persistTheme(mode)
        dispatch({ type: 'set', mode })
      },
      toggleThemeMode: () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'
        persistTheme(nextTheme)
        dispatch({ type: 'toggle' })
      },
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return value
}

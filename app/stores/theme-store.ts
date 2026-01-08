import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Apply theme to document
function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

// Hook to apply theme to document on mount
export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return { theme, setTheme, toggleTheme }
}

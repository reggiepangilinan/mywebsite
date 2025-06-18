'use client'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure theme is set correctly after hydration
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.documentElement.style.colorScheme = savedTheme
    document.documentElement.style.visibility = 'visible'
  }, [])

  return <>{children}</>
}

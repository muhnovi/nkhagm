'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type FontType = 'grotesk' | 'mono'

interface FontContextType {
  font: FontType
  toggleFont: () => void
}

const FontContext = createContext<FontContextType>({
  font: 'grotesk',
  toggleFont: () => {},
})

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFont] = useState<FontType>('grotesk')
  // Tandai apakah sudah mounted di client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Baca localStorage hanya setelah mount di client
    const saved = localStorage.getItem('preferredFont') as FontType
    if (saved === 'grotesk' || saved === 'mono') {
      setFont(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-font', font)
    localStorage.setItem('preferredFont', font)
  }, [font, mounted])

  const toggleFont = () => {
    setFont(prev => (prev === 'grotesk' ? 'mono' : 'grotesk'))
  }

  return (
    <FontContext.Provider value={{ font, toggleFont }}>
      {children}
    </FontContext.Provider>
  )
}

export const useFont = () => useContext(FontContext)

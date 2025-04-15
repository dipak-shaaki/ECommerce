"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering theme elements after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and initial client render, don't apply theme classes to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

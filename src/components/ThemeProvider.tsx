import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react"
import { noop } from "../utils"

import { SunIcon, MoonIcon } from "./Icons"

type ThemeMode = "light" | "dark"

type ThemeContext = {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContext>({
  theme: "light",
  toggleTheme: noop,
})

type ThemeProviderProps = {
  children?: React.ReactNode
}

const themeFlip: Record<ThemeMode, ThemeMode> = {
  dark: "light",
  light: "dark",
}

const isBrowser = () => typeof window !== "undefined"

declare global {
  interface Window {
    __theme: ThemeMode
    __setPreferredTheme: (theme: ThemeMode) => void
  }
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setActiveTheme] = useState(
    isBrowser() && window.__theme ? window.__theme : "light",
  )
  const toggleTheme = useCallback(() => {
    const updated = themeFlip[theme]
    window.__setPreferredTheme(updated)
  }, [theme])

  useEffect(() => {
    const onThemeChanged = (event: CustomEvent<ThemeMode>) =>
      setActiveTheme(event.detail)

    window.addEventListener("themeChanged", onThemeChanged as EventListener)

    return () => {
      window.removeEventListener(
        "themeChanged",
        onThemeChanged as EventListener,
      )
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme()
  const toggleColorMode = (event: React.MouseEvent<HTMLElement>) => {
    toggleTheme()
    event.stopPropagation()
    event.preventDefault()
  }

  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    if (isBrowser()) {
      setDomLoaded(true)
    }
  }, [])

  return (
    <>
      {domLoaded && (
        <button
          className="flex p-2 rounded-md hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-500"
          aria-label="Switch between dark or light theme"
          onClick={toggleColorMode}
        >
          {theme === "dark" ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
      )}
    </>
  )
}

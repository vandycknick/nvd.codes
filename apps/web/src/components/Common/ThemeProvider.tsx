import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react"
import { noop } from "@nvd.codes/utils"

import { SunIcon, MoonIcon } from "components/Common/Icons"

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

const getDefaultTheme = (): ThemeMode => {
  if (isBrowser()) {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  return "light"
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setActiveTheme] = useState(getDefaultTheme())
  const setDarkTheme = () => {
    document.documentElement.classList.add("dark")
    setActiveTheme("dark")
  }
  const setLightTheme = () => {
    document.documentElement.classList.remove("dark")
    setActiveTheme("light")
  }
  const toggleTheme = useCallback(() => {
    const themeChangedEvent = new Event("themeChanged")
    document.dispatchEvent(themeChangedEvent)
    const updated = themeFlip[theme]
    updated === "dark" ? setDarkTheme() : setLightTheme()
  }, [theme])

  useEffect(() => {
    if (isBrowser()) {
      if (theme == "dark") {
        setDarkTheme()
      } else {
        setLightTheme()
      }
    }
  })

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

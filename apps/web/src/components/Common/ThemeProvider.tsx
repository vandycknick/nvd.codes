import React, { useState, createContext, useContext, useCallback } from "react"
import { SunIcon, MoonIcon } from "components/Common/Icons"

const ThemeContext = createContext({
  dark: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
})

type ThemeProviderProps = {
  children?: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [dark, setDarkMode] = useState(false)
  const setDarkTheme = () => document.documentElement.classList.add("dark")
  const setLightTheme = () => document.documentElement.classList.remove("dark")
  const toggleTheme = useCallback(() => {
    const themeChangedEvent = new Event("themeChanged")
    document.dispatchEvent(themeChangedEvent)
    const updated = !dark
    setDarkMode(updated)
    updated ? setDarkTheme() : setLightTheme()
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark: dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const ToggleThemeButton = () => {
  const { dark, toggleTheme } = useContext(ThemeContext)
  const toggleColorMode = (event: React.MouseEvent<HTMLElement>) => {
    toggleTheme()
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <button
      className="flex p-2 rounded-md hover:cursor-pointer hover:bg-nord-200 hover:dark:bg-nord-500"
      aria-label="Switch between dark or light theme"
      onClick={toggleColorMode}
    >
      {dark ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  )
}

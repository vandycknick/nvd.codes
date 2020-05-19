import { colors } from "./colors"

export interface Theme {
  transparent: string

  primary: string
  onPrimary: string
  primaryLight: string
  primaryLighter: string

  navigation: string
  onNavigation: string

  background: string
  onBackground: string

  surface: string
  onSurface: string
}

const darkTheme: Theme = {
  transparent: "transparent",

  primary: colors.teal[700],
  onPrimary: colors.white,

  primaryLight: colors.teal[500],
  primaryLighter: colors.teal[300],

  navigation: colors.grey[800],
  onNavigation: colors.white,

  background: colors.grey[900],
  onBackground: colors.white,

  surface: colors.grey[700],
  onSurface: colors.white,
}

const lightTheme: Theme = {
  transparent: "transparent",

  primary: colors.teal[700],
  onPrimary: colors.white,

  primaryLight: colors.teal[500],
  primaryLighter: colors.teal[300],

  navigation: colors.grey[800],
  onNavigation: colors.white,

  background: colors.white,
  onBackground: colors.black,

  surface: colors.grey[700],
  onSurface: colors.white,
}

export { darkTheme, lightTheme }

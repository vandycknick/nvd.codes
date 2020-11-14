import "@emotion/react"

declare module "@emotion/react" {
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
}

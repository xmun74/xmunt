import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    accent: string
    lightAccent: string
    darkAccent: string
    text: string
    body: string
    bg: {
      accent: string
    }
  }
}

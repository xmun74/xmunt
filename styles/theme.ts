import { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
  accent1: '#fab1a0',
  accent2: '#f8c291',
  accent3: '#d35400',
  text: '#000000',
  bg1: '#fab1a0',
}

export const darkTheme: DefaultTheme = {
  accent1: '#121212',
  accent2: '#bdc3c7',
  accent3: '#2c3e50',
  text: '#ffffff',
  bg1: '#121212',
}

// CSS Variable, 선언 => body{ --text:black; --bg1:white; }  // 개별사용 => background: var(--bg1);
type ThemeRecordType = Record<keyof DefaultTheme, string>

const convertCssVar = (variable: DefaultTheme) => {
  const keys = Object.keys(variable) as (keyof DefaultTheme)[]
  return keys.reduce(
    (acc, key) => acc.concat(`--${key}: ${variable[key]};`, '\n'),
    '',
  )
}
export const themes = {
  light: convertCssVar(lightTheme),
  dark: convertCssVar(darkTheme),
}

const cssVar = (name: string) => `var(--${name})`

// export const themePalette: Record<keyof DefaultTheme, string> = {
//   text: cssVar('text'),
//   background: cssVar('background'),
// }

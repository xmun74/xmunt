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

type VariableKey = keyof DefaultTheme
type ThemeRecordType = Record<VariableKey, string>

/**
 * Theme 객체 key에 --붙여서 변환하기 (body 최상위에서 선언)
 * @param variable
 * @returns "--text1: #212529; --text2: #495057; ... "
 */
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

// themeColor = {"text": "var(--text)", ...} 이렇게 객체만들어야 themeColor.text로 자동완성 사용가능
/** 객체 키를 keyName => var(--keyName)로 변환하기 */
const cssVar = (name: string) => `var(--${name})`

const varKeys = Object.keys(lightTheme) as VariableKey[]
export const themeColor: ThemeRecordType = varKeys.reduce((acc, current) => {
  acc[current] = cssVar(current)
  return acc
}, {} as ThemeRecordType)

import { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
  accent1: '#f5fbfc',
  accent2: '#f8c291',
  accent3: '#f8c291',
  text1: '#000000',
  text2: '#000000',
  text3: '#a2a0a0',
  bg1: '#ffffff',
  bg2: 'rgba(248,194,145,0.7)',
  inlineCode: '#E9ECEF',
  box1: '#ffffff',
  navBgHoverImg: `#F0F1F3`,
  navBgClickImg: `#fae8f3`,
  navGuideBg: `#fae8f3`,
  gnbBackDrop: 'rgba(255, 255, 255, 0.6)',
  boxShadow: ' 0px 3px 30px -10px #6666664b',
  hoverBg: '#F3F2F2',
}

export const darkTheme: DefaultTheme = {
  accent1: '#121212',
  accent2: '#bdc3c7',
  accent3: '#2c3e50',
  text1: '#ECECEC',
  text2: '#bdc3c7',
  text3: '#bdc3c7',
  bg1: '#121212',
  bg2: 'rgba(223, 181, 28, 0.7);',
  inlineCode: '#363636',
  box1: '#424242',
  navBgHoverImg: `#2B2B2B`,
  navBgClickImg: `#232323`,
  navGuideBg: `#2B2B2B`,
  gnbBackDrop: 'rgba(18, 18, 18, 0.6)',
  boxShadow: '0px 3px 30px -10px #f9f9f9c7',
  hoverBg: '#232323',
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
    ''
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

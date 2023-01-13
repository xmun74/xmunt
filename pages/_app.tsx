import type { AppProps } from 'next/app'
import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../styles/GlobalStyle'
import { darkTheme, lightTheme } from '../styles/theme'

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('light')
  const isDarkMode = theme === 'dark'
  const ThemeToggleBtn = () => setTheme(isDarkMode ? 'light' : 'dark')

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
      <button type="button" onClick={() => ThemeToggleBtn()}>
        토글
      </button>
      &nbsp; {theme} 모드
    </ThemeProvider>
  )
}

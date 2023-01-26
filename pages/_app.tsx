import type { AppProps } from 'next/app'
import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../styles/GlobalStyle'
import Layout from '../components/Layout'
import { darkTheme, lightTheme } from '../styles/theme'

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('light')
  const isDarkMode = theme === 'dark'

  return (
    <RecoilRoot>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </RecoilRoot>
  )
}

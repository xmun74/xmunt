'use client'

import GlobalStyle from '@styles/GlobalStyle'
import '@styles/dracula-prism.css'
import StyledComponentsRegistry from '@lib/styled-components-registry'
import { ThemeProvider } from '@lib/theme-context'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}

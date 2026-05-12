'use client'

import Script from 'next/script'
import { Suspense } from 'react'
import GlobalStyle from '@styles/GlobalStyle'
import '@styles/dracula-prism.css'
import StyledComponentsRegistry from '@lib/styled-components-registry'
import { ThemeProvider } from '@lib/theme-context'
import * as gtag from '@lib/gtag'
import isDev from '@lib/isDev'

function GoogleAnalytics() {
  gtag.useGtag()

  return (
    <>
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
    </>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <GlobalStyle />
        {!isDev && (
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
        )}
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}

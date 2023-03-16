import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Script from 'next/script'
import GlobalStyle from '../styles/GlobalStyle'
import '../styles/dracula-prism.css'
import Layout from '../components/Layout'
import * as gtag from '../lib/gtag'
import isDev from '../lib/isDev'

export default function App({ Component, pageProps }: AppProps) {
  if (!isDev) gtag.useGtag()
  return (
    <RecoilRoot>
      <GlobalStyle />
      {!isDev && (
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
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
        </>
      )}

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  )
}

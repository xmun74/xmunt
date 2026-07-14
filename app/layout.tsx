import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import DOMAIN from '@constants/domain'
import pageConfig from '@lib/config'
import isDev from '@lib/isDev'
import Providers from './providers'

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: pageConfig.title,
    template: `%s | ${pageConfig.title}`,
  },
  description: pageConfig.description,
  openGraph: {
    url: pageConfig.url,
    type: 'website',
    siteName: pageConfig.title,
    title: pageConfig.title,
    description: pageConfig.description,
    images: [pageConfig.siteImg],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageConfig.title,
    description: pageConfig.description,
    images: [pageConfig.siteImg],
  },
  verification: {
    google: 'YMNzmqVkQF9Jl8DEiOpcVdm3_s1qrjGyvlkftqWyXIs',
    other: {
      'naver-site-verification': ['886ea33410ff08e87a821b62d4754e453e38d8cd'],
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
      {!isDev && <GoogleAnalytics gaId="G-ZK3Y3LT3RD" />}
    </html>
  )
}

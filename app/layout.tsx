import type { Metadata, Viewport } from 'next'
import DOMAIN from '@constants/domain'
import pageConfig from '@lib/config'
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

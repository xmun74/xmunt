---
title: 'NextJS 블로그에 Google Analytics 추가하기'
description: 'Google Analytics 추가'
coverImage: ''
image: ''
date: '2023-03-09'
path: 'google-analytics'
category: 'Google Analytics'
tags:
  - 'GA'
---

# [Google Analytics](https://analytics.google.com/analytics)

1. 관리 - 데이터스트림 - 스트림 추가 - 내사이트 입력
2. 태그 안내보기 - `직접 설치`
3. 파일 설정 [nextjs예시](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)

- `.env` 추가
  `NEXT_PUBLIC_GA_ID='G-로 시작하는 id복붙'`

- 공식예시가 gtag.js여서 ts 타입 정의를 위해 설치
  `npm i -D @types/gtag.js`

- `lib/gtag.tsx` 생성

```tsx:lib/gtag.tsx showLineNumbers
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: Gtag.EventNames,
  { event_category, event_label, value }: Gtag.EventParams,
) => {
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
  })
}

// page view
export const useGtag = () => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
```

- `_app.tsx`에 추가하기

```tsx:_app.tsx showLineNumbers
import Script from 'next/script'
import * as gtag from '../lib/gtag'
import isDev from '../lib/isDev'
// 생략
export default function App({ Component, pageProps }: AppProps) {
  gtag.useGtag()

  return (
    <RecoilRoot>
      {/* 생략 */}
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

      {/* 생략 */}
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

```

- `{!isDev && ( ... ) }` 배포 모드일때만 해당 script를 추가하게 함
- `id="gtag-init"`으로 html에 추가됐는지 확인할 수 있게 함

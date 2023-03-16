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
  - 'NextJS'
---

# [Google Analytics](https://analytics.google.com/analytics)

구글에서 무료로 제공하는 도구로 사이트에 들어오는 사용자 유입, 조회수, 사용자 유형 등을 분석하여 통계를 내준다

1. 관리 - 데이터스트림 - 스트림 추가 - 내사이트 입력
2. 태그 안내보기 - `직접 설치`
3. 파일 설정 - [NextJS 예시](https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js)

- 공식예시가 gtag.js여서 ts 타입 정의를 위해 설치

  ```bash
  npm i -D @types/gtag.js
  ```

- `lib/gtag.tsx` 생성

```tsx:lib/gtag.tsx showLineNumbers
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const GA_TRACKING_ID = `G-로 시작하는 id복붙`

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
- 배포 후 사이트 html Elements탭에서 `id="gtag-init"`으로 검색해서 잘 추가됐는지 확인하기
- 구글 애널리틱스에 표시되기까지 24-48시간 정도 걸린다고 한다..

## 실시간 사용자 수 보기

- [Google Analytics](https://analytics.google.com/analytics)에 왼쪽 탭에서 `보고서` 클릭 - `실시간` 클릭
  밑처럼 실시간 사용자 수를 분석한 통계를 볼 수 있다!
  ![230316-132736](/images/posts/google-analytics/230316-132736.png)

# Google Search Console과 연결

구글에서 검색해서 들어온 통계를 보기 위해서 연결하기

- 관리자 - Search Console 링크 - 연결
  ![230309-161524](/images/posts/google-analytics/230309-161524.png)

#### 구글 콘솔에서 사이트 통계보기

- [구글 콘솔](https://search.google.com/search-console) - 개요 - 오른쪽 상단 `Search Console Insights` 클릭

#### 참고

- [nextjs예시](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)
- https://kimyanglogging.tistory.com/3
- https://velog.io/@yunsungyang-omc/Next.js-Google-Analystics-%EC%9D%B4%EC%8B%9D%ED%95%98%EA%B8%B0

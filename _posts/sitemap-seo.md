---
title: 'NextJS로 만든 블로그 글 검색되게 하자! - sitemap, 검색엔진'
description: '블로그 글이 사이트에서 검색되게 만들기'
coverImage: ''
image: ''
date: '2023-03-08'
path: 'sitemap-seo'
category: 'NextJS'
tags:
  - '검색엔진'
---

작성한 블로그 글이 네이버, 구글 등에서 검색되게 하고 싶다면?
각 사이트 검색엔진에 블로그 주소를 등록하고 sitemap을 생성해야한다!

# 1. sitemap

[구글 사이트맵 설명](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ko)
sitemap이란 사이트의 정보를 제공하는 파일이다.
검색엔진이 이 파일을 읽고 더 효율적으로 사이트를 크롤링할 수 있게 도움을 준다.
검색엔진에 사이트맵 url을 추가해야되기 때문에 먼저 sitemap부터 생성하도록 하겠다

- `next-sitemap` 라이브러리 설치

```bash
npm i -D next-sitemap
```

- `next-sitemap.config.js` 생성

- `package.json` 수정
  ` "build": "next build && next-sitemap && next export",`

- npm run build 하면
  `public/robots.text`, `public/sitemap.xml`, `public/sitemap-0.xml` 파일 생성됨
  원격 push 안되게 gitignore에 추가

# 2. 검색엔진

- 구글 서치 콘솔 - [Google Search Console](https://search.google.com/search-console/welcome?utm_source=about-page)
- 네이버 서치 어드바이저- [Naver Search Advisor](https://searchadvisor.naver.com/)

## [Google Search Console](https://search.google.com/search-console/welcome?utm_source=about-page)

1. 사이트 등록 - 도메인이 있다면 도메인을 등록하거나, URL접두어를 등록하기

![230308-123054](/images/posts/sitemap-seo/230308-123054.png)

![230308-123528](/images/posts/sitemap-seo/230308-123528.png)

2. `_document.tsx`에 위에서 복사한 HTML `meta` 태그 추가

```js:_document.tsx {4-7} showLineNumbers
    return (
      <Html>
        <Head>
          <meta
            name="google-site-verification"
            content="복붙"
          />
          {/*  */}
        </Head>
          {/*  */}
      </Html>
    )
```

3. 배포까지 하면 `확인` 클릭
4. 사이트맵 url `sitemap.xml` 제출

![230309-111659](/images/posts/sitemap-seo/230309-111659.png)

## [Naver Search Advisor](https://searchadvisor.naver.com/console/board)

1. 사이트 등록
2. `_document.tsx`에 HTML `meta` 태그 추가
3. 배포 후 `소유확인` 클릭
4. 요청 - 사이트맵 제출 `sitemap.xml` 입력

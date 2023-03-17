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
  - 'SEO'
---

작성한 블로그 글이 네이버, 구글 등에서 검색되게 하고 싶다면?
각 사이트 검색엔진에 블로그 주소를 등록하고 sitemap을 생성해야한다!

# 1. sitemap

[구글 사이트맵 설명](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ko)
sitemap이란?
사이트에 있는 페이지, 동영상 등의 정보를 제공하는 파일이다.
검색엔진이 sitemap 파일을 읽고 더 효율적으로 사이트를 크롤링할 수 있게 도움을 준다.
따라서 검색했을 때 해당 사이트가 검색되게 하려면? sitemap을 생성해서 등록해주면 된다.
검색엔진에 사이트맵 URL을 추가해야되기 때문에 먼저 sitemap 파일부터 생성해보자!

## 방법 1. `next-sitemap` 라이브러리로 sitemap.xml 만들기

- [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) 라이브러리 설치

```bash
npm i -D next-sitemap
```

- `next-sitemap.config.js` 생성하고

  ```js:next-sitemap.config.js
  /** @type {import('next-sitemap').IConfig} */
  module.exports = {
    siteUrl: '본인 사이트 url',
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    generateRobotsTxt: true,
    exclude: [],
  }
  ```

- `tsconfig.json`에 "next-sitemap.config.js"을 추가한다

  ```json:tsconfig.json {6} showLineNumbers
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.d.ts",
    "next-sitemap.config.js"
  ],
  ```

- `package.json` 수정
  ` "build": "next build && next-sitemap && next export",`

- npm run build 하면
  `public/robots.txt`, `public/sitemap.xml`, `public/sitemap-0.xml` 파일 생성됨
  원격 push 안되게 gitignore에 추가하기

> - `sitemap.xml` - 어떤 URL을 크롤링하는 지 알려주는 역할
> - `robots.txt` - 어떤 URL에 접근할 수 있는지 검색엔진 크롤러에 알려주는 역할

## 방법 2. 직접 sitemap.xml 만들기

원래는 `next-sitemap` 라이브러리를 사용했는데 자꾸 구글 콘솔에 인식이 안되서 직접 만들기로 했다.

# 2. 검색엔진 등록 방법

### 검색엔진 종류

내 블로그는 주로 사용하는 구글과 네이버 검색엔진을 등록하기로 했다.

- 구글 서치 콘솔 - [Google Search Console](https://search.google.com/search-console/welcome?utm_source=about-page)
- 네이버 서치 어드바이저- [Naver Search Advisor](https://searchadvisor.naver.com/)
- [다음 검색등록](https://register.search.daum.net/index.daum)

## [Google Search Console](https://search.google.com/search-console/welcome?utm_source=about-page)

1. 사이트 등록 - 도메인이 있다면 도메인을 등록하거나, URL접두어를 등록하기
   ![230308-123054](/images/posts/sitemap-seo/230308-123054.png)

2. 아래의 HTML `meta` 태그를 `_document.tsx` `Head`에 추가
   ![230308-123528](/images/posts/sitemap-seo/230308-123528.png)

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
4. 요청 - 사이트맵 제출 `본인 url/sitemap.xml` 입력
5. 검증 - robots.txt - 수집요청 클릭, 검증 확인받기
6. 설정 - 수집주기설정 - `빠르게`

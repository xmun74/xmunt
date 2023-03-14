---
title: 'NextJS로 만든 블로그 이쁘게 공유하기 - Open Graph'
description: 'Open Graph로 SNS 공유 최적화해보자'
coverImage: ''
image: ''
date: '2023-03-14'
path: 'open-graph'
category: 'SEO'
tags:
  - og
  - OpenGraph
  - SEO
---

#### 🤬 정보가 없는 미리보기

![230314-185422](/images/posts/open-graph/230314-185422.png)
만약 위처럼 블로그를 공유했는데
아무런 정보가 없고 뭐하는 사이트인지도 모르겠다면?
링크 누르기가 싫어진다...

<br></br>

#### 🥳 정보가 풍부한 미리보기

![230314-185428](/images/posts/open-graph/230314-185428.png)
이번엔 위처럼 SNS에 블로그 링크를 공유할때
좀 더 이쁘면서 정보도 풍부하게 미리볼 수 있다면?
보는 사람들도 궁금해서 링크를 클릭할 것이다!

<br></br><br></br>

# Open Graph 🖼

링크를 공유했을 때 정보를 표시해주는 open graph를 적용해보자!
Open Graph는 통일된 메타데이터를 작성하도록 정의한 규약이다. Facebook, Twitter는 자체 프로토콜을 가지고 있다.
자세한 메타데이터 및 속성은 [Open Graph Protocol](https://ogp.me/)를 참고하면 된다.

<br></br>

## og 메타데이터 작성하기

`next-seo` 라이브러리를 사용해도 되지만 복잡한 사이트구조가 아니라고 판단하여 직접 `meta`태그를 작성했다.

- 기본 메타데이터 예시
  밑의 4가지 속성은 필수로 작성해야하는 속성이다.

```html
<head>
  <meta property="og:title" content="The Rock" />
  <meta property="og:type" content="video.movie" />
  <meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
  <meta
    property="og:image"
    content="https://ia.media-imdb.com/images/rock.jpg"
  />
  ...
</head>
```

- 블로그에 적용한 코드

```tsx
<Head>
  {/* HTML Meta Tags */}
  <title>{`${post?.title} | ${pageConfig.title}`}</title>
  <meta name="description" content={`${pageConfig.title}`} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  {/* Facebook Meta Tags */}
  <meta
    property="og:url"
    content={`https://xmunt.vercel.app/blog/${post?.slug}`}
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:site_name"
    content={`${post?.title} | ${pageConfig.title}`}
  />
  <meta property="og:title" content={`${post?.title} | ${pageConfig.title}`} />
  <meta property="og:description" content={post?.description} />
  <meta property="og:image" content={`${DOMAIN}${post?.coverImage}`} />

  {/* Twitter Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="xmunt.vercel.app" />
  <meta
    property="twitter:url"
    content={`https://xmunt.vercel.app/blog/${post?.slug}`}
  />
  <meta name="twitter:title" content={`${post?.title} | ${pageConfig.title}`} />
  <meta name="twitter:description" content={post?.description} />
  <meta name="twitter:image" content={`${pageConfig.siteImg}`} />
  <meta name="twitter:label1" content="Category" />
  <meta name="twitter:data1" content={`${post?.category}`} />
</Head>
```

#### 직접 메타태그 하나하나 작성하는게 번거롭다면?

[Open Graph prewiew & generate](https://www.opengraph.xyz/url/https%3A%2F%2Fxmunt.vercel.app%2F) 이 사이트에서는 메타데이터가 적용됐는지 각 SNS 별 미리보기를 볼 수 있고, 속성을 입력하면 자동으로 메타태그 생성도 해준다.

<br></br><br></br>

# 문제: 카카오톡 미리보기 업데이트가 안될 때

### 상황

분명히 `meta` 태그 다 적용해서 배포했고 다른 사이트들에선 잘 적용되는데
카톡에서만,, 계속 og가 적용안된 미리보기가 보였었다!

![230314-185422](/images/posts/open-graph/230314-185422.png)

### 원인

- 캐시가 문제!
- og `meta`태그를 안 넣었을 때 이미 카톡에 url 공유를 했었던 것!
- pc, 모바일에서 이미 전에 url 공유를 했었어서 해당 url 캐시가 남아있어서 그 전 미리보기를 불러왔던 것이었다.

### 해결

이럴 때는 카카오톡 캐시를 삭제하면 된다! 캐시 삭제 후 og가 반영된 미리보기로 잘 보여졌다!

#### PC 캐시 삭제하기

[카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 URL 입력 후 캐시 초기화

#### 모바일 캐시 삭제하기

카톡 하단 맨 오른쪽 `...`설정탭 - 맨 아래 앱 관리 - 저장공간 관리 - 캐시 데이터 삭제(사진,동영상,음성파일은 유지됨)

---
title: 'NextJS에서 무한스크롤 구현 1'
description: 'Intersection Observer API를 사용하여 무한 스크롤링 구현하기'
coverImage: ''
image: ''
date: '2023-03-29'
path: 'nextjs-infinite-scroll'
category: '무한 스크롤'
tags:
  - 'Intersection Observer'
  - '무한 스크롤'
---

## 적용하는 이유

현재 블로그에서 글 목록을 볼 때 모든 글을 출력하고 있었다.
글 목록에서 getStaticProps로 총 게시글을 prop로 전달하는 방식이었다.
이렇게 되면 글 목록 개수가 많을 때 getStaticProps로 전달하는 props 용량이 128kb를 초과하면 warn을 출력한다.

그래서 페이지네이션이나 무한스크롤을 적용하여 필요한 부분들 데이터만 나눠 받을 수 있게 하는 것이 바람직했다.

페이지네이션은 페이지 이동을 위해 따로 클릭을 해야하지만
무한스크롤은 그냥 스크롤만 하면 원하는 데이터를 볼 수 있다.
따라서 무한스크롤을 선택하여 구현하고자 한다.

### 무한 스크롤 단점

- 페이지 성능 느려짐
- 뒤로가기 시 이전 위치 기억해야함
- 푸터 찾기 어려워짐

## 무한스크롤 구현 방법

1. scroll event - throttle 구현(스크롤 이벤트 성능개선을 위해)
2. Intersection Opserver API
   +react-query 사용시 useInfiniteQuery를 활용하는 방법

#### 구현할 것

- 최하단까지 스크롤하면 N개 데이터 로드
- 받아올 다음 데이터 없으면 무한 스크롤 중지
- 로딩중, 스켈레톤 UI 로드
- 목록에서 스크롤 내리고 1개 글 클릭해서 들어갔다가
  뒤로가기 누르면 이전 스크롤 위치 기억하기

---

# Intersection Opserver API

[Intersection Opserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 는 상위요소나 viewport에서 해당 요소가 교차될 때 변경사항을 비동기식으로 관찰할 수 있게 하는 API다. 예를 들어 컴퓨터 화면에서 특정 요소가 보여질 때를 관찰하여 콜백함수를 실행하게 하는 것이다.

## 1. Intersection Opserver 개념

#### Intersection Observer 인스턴스 생성하기

```js
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0,
}

// Intersection Opserver 생성
// 요소가 관찰되면 1번째 인자인 콜백함수 실행, 2번쨰 인자로 옵션 지정
let observer = new IntersectionObserver(callback, options)
```

#### options

- `root` - 대상이 root에 들어오면 콜백함수를 실행함. (기본값인 `null`은 viewport가 지정됨)
- `rootMargin` - root의 margin값 [상,오,하,왼] 지정 가능. (기본값 0)
- `threshold` - 대상의 가시성 비율을 나타내는 숫자나 배열로, 대상이 얼마나 보이느냐에 따라 콜백함수 실행함. 0.5 - 대상이 root에서 50% 보이면 감지 / 1.0- 대상 전체가 보이면 감지 (기본값 0)

#### callback 함수

타겟 요소의 관찰이 시작될 때 실행되는 콜백함수

```js
let callback = (entries, observer) => {
  entries.forEach((entry) => {
    // entry.isIntersecting :target의 교차여부를 boolean값으로 출력
    // entry.target
  })
}
```

- `entries` - target의 배열. 현재상태에 대한 속성들이 존재함.
- `observer` - 콜백함수 호출한 observer

#### 메서드

```js
// 타겟 관찰 시작
observer.observe(target)
// 타겟 관찰 중단
observer.unobserve(target)
// 모든 관찰 중단
observer.disconnect()
```

#### 관찰할 요소 타겟팅하기

```tsx
/* JS 버전 */
let target = document.querySelector("#listItem");
observer.observe(target);

/* React + TS 버전 */
let target = useRef<HTMLDivElement>(null);
observer.observe(target.current as Element);
// ...
return (
{/* ... */}
<div ref={target}></div>
)
```

## 2. 커스텀 훅 만들기

- 무한 스크롤, 스켈레톤 UI, 지연 로딩 등에서도 사용될 수 있으므로 Hook으로 분리하여 구현해보자.

```tsx:useIntersect.tsx
/* NextJS + TS 버전 */
import { useCallback, useEffect, useRef } from 'react'

interface IntersectionObserverInit {
  root?: Element | Document | null
  rootMargin?: string
  threshold?: number | number[]
}

type IntersectHandler = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver,
) => void

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
}

export default function useIntersect(
  onIntersect: IntersectHandler,
  options?: IntersectionObserverInit,
) {
  const target = useRef<HTMLDivElement>(null)

  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry, observer)
        }
      })
    },
    [onIntersect],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      ...defaultOptions,
      ...options,
    })
    if (target.current) {
      observer.observe(target.current as Element)
    }
    return () => observer && observer.disconnect()
  }, [target, callback, options])

  return target
}
```

### 3. 훅 사용한 곳

```tsx
export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(0)
  const [nextPage, setNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const { contents, pageNumber, isLastPage } = await blogsApi.getBlogs(
      page,
      8,
    )
    setBlogs(blogs.concat(contents))
    setPage(pageNumber + 1)
    setNextPage(!isLastPage)
    setIsLoading(false)
  }

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target)
    if (nextPage && !isLoading) {
      fetchData() // 다음페이지 있고 로딩중 아닐때 fetch 하기
    }
  })
  return (
    <>
      {/* ... */}
      <div ref={target}>{isLoading && <div>Loading...</div>}</div>
    </>
  )
}
```

#### 조건문에 충족할 때만 fetch하기

하단까지 스크롤했을 때 데이터 fetch를 계속 반복하면 안되므로
조건문에 해당할 때만 fetch하도록 구성한다.
예를 들어 다음 데이터가 있고, 로딩중이 아닐때만 fetch를 하도록 한다.

#### API 요청 2번하는 이유

React의 Strict Mode 엄격 모드에서는 페이지 진입 시 api 호출이 2번 발생한다. 코드를 엄격하게 검사해서 경고 메시지를 출력해주기 때문에 이를 보고 미리 에러를 방지할 수 있다.

- 개발 모드에서만 활성화되고 배포 환경에서는 발생 안한다.
- NextJS는 `next.config.js`에서 엄격모드가 켜져있는 것을 볼 수 있다.
  ```js:next.config.js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true, // Strict Mode가 켜져있다
    //...
  }
  module.exports = nextConfig
  ```

#### React에서는 useEffect 안에서 인스턴스 생성

useEffect에서 렌더링 되고 나서 해당 target이 있을 때 관찰을 시작하고
return 문에서 `disconnect()`해서 언마운트될 때 관찰을 중단한다.

#### 뒤로가기 시 이전 스크롤 위치 기억하기

뒤로가기 시 스크롤 유지는 다음 글에서 설명하도록 하겠다.

<br /><br /><br />

---

> 참고

https://tech.kakaoenterprise.com/149
[(React) 무한 스크롤 기능 구현하기 : used by Intersection Observer - 2](https://velog.io/@yunsungyang-omc/React-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-used-by-Intersection-Observer-2)
[무한 스크롤(Infinite scroll) 구현하기](https://velog.io/@eunoia/%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4Infinite-scroll-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
[[React] 무한 스크롤 적용하기](https://velog.io/@sjoleee_/React-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4#%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4%EC%9D%84-%EB%8F%84%EC%9E%85%ED%95%98%EA%B2%8C-%EB%90%9C-%EC%9D%B4%EC%9C%A0)

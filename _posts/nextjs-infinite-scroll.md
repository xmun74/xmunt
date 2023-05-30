---
title: 'Intersection Observer API로 무한스크롤 구현하기'
description: 'Intersection Observer API를 사용하여 긴 목록을 렌더링하는 무한 스크롤링 구현하기'
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

이전에는 블로그에서 글 목록 페이지에 접속했을 때 모든 글을 출력해주고 있었습니다.
예를 들어 100개 글이 있다면 1번 요청에 100개를 받아오는 방식이었습니다.
그래서 긴 목록을 렌더링할 때 사용하는 페이지네이션이나 무한스크롤을 적용하여 필요한 데이터만 나눠 받을 수 있게 하는 방법으로 구현하고자 했습니다.
<br/>
먼저 페이지네이션은 페이지 이동을 위해 따로 클릭을 해야하지만
무한스크롤은 그냥 스크롤만 하면 추가 데이터를 볼 수 있습니다.
따라서 사용자 경험을 높이기 위해서 스크롤만해서 새 데이터를 볼 수 있는 무한스크롤을 선택했습니다. 이 글에서는 무한스크롤 방식을 Intersection Opserver API를 사용하여 구현하고자 합니다.

### 무한 스크롤 한계점

- 뒤로가기 시 이전 스크롤 위치 기억하는 추가 작업 필요
- 푸터 찾기 어려워짐

## 무한스크롤 구현 방법

1. scroll event

   - throttle이나 requestAnimationFrame으로 구현
     : 스크롤 이벤트 성능 개선을 위해서 위에 해당된 추가 작업이 필요하다

2. Intersection Opserver API

#### 구현 사항

- 최하단까지 스크롤하면 N개 데이터 fetch하기
- 받아올 다음 데이터 없거나 로딩중일 때 fetch 중지

#### 추가 구현 사항

- 목록에서 스크롤 내리고 1개 상세페이지로 들어갔다가
  뒤로가기 누르면 이전 스크롤 위치 기억하기
- 로딩중일 때, 스켈레톤 UI 로드

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

---

## 2. 커스텀 훅 만들기

커스텀 훅으로 만들어두면 무한 스크롤, 스켈레톤 UI, 지연 로딩 등에서도 재사용할 수 있으므로 Hook으로 분리하여 구현해봅시다.

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

#### React에서는 useEffect 안에서 인스턴스 생성

useEffect에서 렌더링이 되고 나서 해당 target이 있을 때 `observe()`로 관찰을 시작하고
`return()`문에서 언마운트될 때 `disconnect()`하여 관찰을 중단한다.

<br />

### Hook 사용처

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
      {/* fetch로 받은 limit있는 N개 목록 ... */}
      <div ref={target}>{isLoading && <div>Loading...</div>}</div>
    </>
  )
}
```

#### 최하단까지 스크롤하면 N개 데이터 fetch하기

fetch로 받아온 제한된 개수를 가진 목록이 있고, 그 목록 바로 밑에 target을 두어서 target에 도달했을 때 새 데이터를 fetch 받도록 했습니다.

#### 다음 데이터가 있고, 로딩중이 아닐 때만 fetch하기

최하단까지 스크롤했을 때 데이터 fetch를 계속 반복하면 안되기 때문에
조건문에 해당될 때만 fetch하도록 구성해야 합니다.
예를 들어 다음 데이터가 있고, 로딩중이 아닐때만 fetch를 하도록 합니다.

# 마치며

목록을 출력하는 방법으로 무한 스크롤이 있지만 이 방법에도 한계점이 있습니다. 밑처럼 추가 구현해야 될 사항들이 있습니다.

- 뒤로가기 시 이전 스크롤 위치 기억하기
- 불러온 데이터만큼 DOM 노드 증가하기 때문에 렌더링 최적화 작업 필요
- 로딩중일 때 스켈레톤 UI 출력하기

이 중에서 뒤로가기 구현은 스크롤 위치를 기억해야한다는 점이 있습니다.
먼저 무한스크롤로 데이터를 N개까지 로드한 이후에 상세 페이지로 이동했다가 뒤로가기로 돌아오면 데이터가 초기화되어 있습니다.
간단하게 구현하려면 상세페이지를 모달로 구현하거나 이전 데이터를 전부 저장해놓는 방법이 있습니다.
하지만 이전 데이터가 100페이지가 넘는다거나 대량의 데이터라면 저장하기가 부담스럽습니다.
또는 세션스토리지에 스크롤높이를 저장해두고, 뒤로가기시 padding-bottom으로 저장해둔 값을 설정하는 방법이 있습니다. 하지만 이도 1페이지부터~N페이지까지 전부 요청을 다시 해야되기 때문에 서버에 부담이 가고 로딩시간이 길어진다는 점이 있습니다.
<br/>
그리고 이와 연관되서 DOM 노드 수가 증가한다는 문제가 발생됩니다. 이전 데이터를 다 불어오면 DOM 노드 수가 증가하기 때문에 그만큼 렌더링 시간도 증가한다는 문제가 있습니다. 따라서 가상화목록(or windowing)이라는 렌더링 최적화방식을 적용해야 할 필요성이 있습니다.
이와 관련된 내용은 다음 포스트부터 설명하도록 하겠습니다.
<br/>
무한스크롤 방식이 사용자 경험 향상에 도움이 되지만, 한계점이 있고 이에 따라 추가적인 작업을 구현해야 한다는 점이 있습니다. 모든 사이트가 무한스크롤을 사용하지 않는 것은 이러한 문제들이 있었기 때문이라고 생각했습니다. 따라서 각 방식의 트레이드오프를 비교해서 해당 서비스에 맞는 효과적인 방식을 선택하는 것이 바람직하다고 생각합니다.

<br /><br /><br />

---

> 참고

[실전 Infinite Scroll with React - kakaoenterprise](https://tech.kakaoenterprise.com/149)
[(React) 무한 스크롤 기능 구현하기 : used by Intersection Observer - 2](https://velog.io/@yunsungyang-omc/React-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-used-by-Intersection-Observer-2)
[무한 스크롤(Infinite scroll) 구현하기](https://velog.io/@eunoia/%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4Infinite-scroll-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
[[React] 무한 스크롤 적용하기](https://velog.io/@sjoleee_/React-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4#%EB%AC%B4%ED%95%9C%EC%8A%A4%ED%81%AC%EB%A1%A4%EC%9D%84-%EB%8F%84%EC%9E%85%ED%95%98%EA%B2%8C-%EB%90%9C-%EC%9D%B4%EC%9C%A0)

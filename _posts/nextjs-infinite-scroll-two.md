---
title: '무한스크롤 구현에서 뒤로가기 시 스크롤 유지를 해보자'
description: '뒤로가기 시 이전 스크롤 위치로 복구(scroll restoration)되게 하자'
coverImage: ''
image: ''
date: '2023-03-30'
path: 'nextjs-infinite-scroll-two'
category: '무한 스크롤'
tags:
  - '무한 스크롤'
  - '스크롤 유지'
---

# 뒤로가기 시 이전 스크롤 위치로 복구하기

무한 스크롤로 많은 목록들을 스크롤해서 내렸다가
1개 글을 클릭한 후
뒤로가기를 눌렀는데 맨 위로 되돌아가졌다.
아까 그 위치로 계~속 스크롤해서 내려가자니 여간 불편한 게 아니다...
이러한 사용자 경험을 향상시키기 위해 이전 스크롤 위치를 기억해서 복구할 필요가 있다!

### 구현할 것

- 경로 변경 전(글 목록 -> 글 상세)에 스크롤위치 저장하기
- 뒤로가기를 해서 해당 경로에 왔는 지 체크
- 뒤로가기로 왔으면 저장했던 스크롤위치로 복구

### 구현 코드

```tsx:useScrollRestoration.tsx
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  getSessionStorage,
  removeWebStorage,
  setSessionStorage,
} from '../webStorage'

export default function useScrollRestoration() {
  const router = useRouter()

  useEffect(() => {
    let scrollStore: null | { x: number; y: number }

    const onRouteChangeStart = () => {
      setSessionStorage('scroll-position', {
        x: window.pageXOffset,
        y: window.pageYOffset,
      })
      //   console.log('1. 경로변경 전 저장', window.pageXOffset, window.pageYOffset)
    }

    const onRouteChangeComplete = () => {
      if (scrollStore) {
        const { x, y } = scrollStore
        // console.log('3. 경로변경 후 (복구)', scrollStore)
        setTimeout(() => window.scrollTo(x, y), 50)
        scrollStore = null
        removeWebStorage('scroll-position', 'session')
      }
    }

    router.beforePopState(() => {
      scrollStore = getSessionStorage('scroll-position')
      //   console.log('2. 뒤로가기 전 실행', scrollStore)
      return true
    })
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
}
```

위 해당 코드를 `_app.tsx`에서 실행시켰다. 먼저 코드를 보면서 설명해보자면,
next-router의 [router.events](https://nextjs.org/docs/api-reference/next/router#routerevents)를 활용하여 경로가 이동될 때 함수를 실행하게 했다.
참고로 라우터 이벤트는 useEffect에서 구독하여 실행해야한다.

- `routeChangeStart(url, { shallow })` - 경로가 변경되기 시작할때 발생

- `routeChangeComplete(url, { shallow })` - 경로가 완전히 변경되면 발생

- [router.beforePopState](https://nextjs.org/docs/api-reference/next/router) - 경로 작동 전 실행함. return값이 true면 popstate를 호출함

  - [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) : 뒤로가기/앞으로가기 버튼 클릭 시 호출됨

#### 구현 과정

> 경로 이동 예시 : 글 목록 (스크롤 후)=> 글 상세

1. 경로 이동 시작될 때(routeChangeStart) 스크롤위치를 sessionStorage에 저장
2. 뒤로가기 클릭해서 경로 작동되기 전에(beforePopState) sessionStorage에 저장된 값을 변수(scrollStore)에 할당함
3. 경로 완전히 변경된 후(routeChangeComplete) 변수에 저장된 값이 있으면 스크롤 위치 복구 후 다시 초기화해줌

# 문제

# 참고

https://coffeeandcakeandnewjeong.tistory.com/94
https://helloinyong.tistory.com/300

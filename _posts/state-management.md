---
title: '상태관리 '
description: '상태관리에 대해서 알아보자'
coverImage: ''
image: ''
date: '2023-05-16'
path: 'state-management'
category: ''
tags:
  - '상태관리'
---

# Client State

다양한 상태관리 라이브러리들이 존재하는데 각각의 차이점과 특징을 토대로 정리해보고자 한다! 먼저 클라이언트 상태관리의 접근 방식은 다음과 같이 3가지로 나뉘게 된다.

1. Flux 패턴 - Redux, Zustand
2. Proxy 패턴 - Mobx, Valtio
3. Atomic 패턴 - Recoil, Jotai

### 1. Flux 패턴 - Redux, Zustand

Facebook이 사용하는 Flux 패턴을 기반으로 구현

- 모놀리식의 중앙 집중식 단일 저장소
  큰 단일 객체에 모든 전역 상태를 저장하는 방식
  단일 전역저장소를 구동해서 요소에서 데이터에 접근할 수 있으며
  트리거 작업을 통해서 업데이트 된다.

- 하향식 접근(Top-down)
- 단방향 데이터 흐름
  `Actions -> Reducer -> Store -> View`
  이전에 MVC 패턴의 양방향 데이터 흐름일 때
  컴포넌트 계층 구조가 많아지면서
  컴포넌트 간 상태 교환의 복잡도가 증가하고
  예측이 안되는 버그가 계속 발생됐었다.
  이를 해결하기 위해 Flux 패턴의 단방향 구조를 사용하여
  상태관리를 컴포넌트에서 아예 분리(외부로)하게 됐다.
- 디버깅에 용이함
- 외부에 데이터를 저장하고 React 없이 사용가능
- 동시성 모드를 해결하기 위해 리액트에서 [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)훅을 제공하고 있음

### 2. Atomic 패턴 - Recoil, Jotai(죠-타이)

- atom 단위의 상태
  atom은 업데이트, 구독 가능한 상태 단위
- 상향식 접근(Bottom-up)
  세분화된 원자(Atom)상태에서 selector에 결합하여 더 큰 상태로 확장하는 것.
- React 트리 내부에 상태가 저장됨.
- React State를 사용하여 Concurrent 동시성 제공되거나 호환됨
- 리액트 라이브러리로 리액트에서만 사용가능

### 3. Proxy 패턴 - Mobx, Valtio

상태를 프록시로 래핑 트리 어느 곳에서 상태 일부 구독 가능
공유 상태 위에 추가 논리를 실행할 수 있다.
코드 추상화

- 컴포넌트의 상태를 자동으로 감지하고 업데이트하는 방식
- 디버깅이 어렵지만 Store에 바로 접근하여 변경 가능함
- 외부에 데이터를 저장하고 React없이 사용가능

### Redux RTK

- 러닝 커브가 높고 초반 설정 많음. RTK가 조금 더 편하지만 그래도 초반엔 어려움

### Recoil

- 러닝커브가 낮고 리액트 전용 라이브러리

<br><br>

---

<br><br>

# Server State

React Query, SWR, Apollo, RTK Query 등이 서버의 데이터를 가져와서 서버상태를 관리하는 도구다.

- REST API(서버) 처리 - React Query, SWR
- GraphQL(서버) 처리- Apllo, urql

### React Query

- React Query = REST API(서버) 처리

### Apllo Client

- Apllo Client = GraphQL(서버) 처리

<br><br>

---

### Context API

단점

- [불필요한 리렌더링](https://legacy.reactjs.org/docs/context.html#caveats)

<br><br><br><br/>

# 참고

- [kakaopay Tech- 카카오페이 프론트엔드 개발자들이 React Query를 선택한 이유](https://tech.kakaopay.com/post/react-query-1/)
- [우아한형제들 - Store에서 비동기 통신 분리하기 (feat. React Query)](https://techblog.woowahan.com/6339/)
- [kakao Tech - My구독의 React Query 전환기](https://tech.kakao.com/2022/06/13/react-query/)
- [오픈소스컨설팅- React-Query 도입을 위한 고민 (feat. Recoil)](https://tech.osci.kr/2022/07/13/react-query/)

- [블로그 답변: React Context가 "상태 관리" 도구가 아닌 이유(및 Redux를 대체하지 않는 이유)](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)

- [https://ridicorp.com/story/how-to-use-redux-in-ridi/](https://ridicorp.com/story/how-to-use-redux-in-ridi/)
- [https://tech.osci.kr/2023/03/20/state/](https://tech.osci.kr/2023/03/20/state/)
- [Recoil - 또 다른 React 상태 관리 라이브러리? -toast](https://ui.toast.com/weekly-pick/ko_20200616)
- [https://haruair.github.io/flux/docs/overview.html](https://haruair.github.io/flux/docs/overview.html)
- [[번역] 리액트 상태 관리의 새로운 흐름](https://medium.com/@yujso66/%EB%B2%88%EC%97%AD-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%ED%9D%90%EB%A6%84-6e5ed0022e39)

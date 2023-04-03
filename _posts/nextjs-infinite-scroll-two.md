---
title: 'NextJS에서 무한스크롤 구현 2 - 스크롤 유지'
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

## 1. 뒤로가기 이벤트 감지하기

next-router의 router.events를 사용하여 경로가 이동될 때 함수를 실행하게 한다.

- `routeChangeStart(url, { shallow })`
  경로가 변경되기 시작할때 발생

- `routeChangeComplete(url, { shallow })`  
  경로가 완전히 변경되면 발생

## 2. 스크롤 위치를 sessionStorage에 저장

글 목록 => 글 상세 페이지로 url 경로를 변경하기 전 스크롤 위치 기억해서 sessionStorage에 저장하기로 했다.
저장하는 순간이 경로가 변경된 후의 스크롤 위치가 아니라, 변경 전의 스크롤 위치를 저장한다.

- 글 목록에서 글 상세 클릭하기 전 sessionStorage에 페이지를 저장하고 나서
  뒤로가기 이벤트 감지 시 sessionStorage에서 저장된 page 불러와 값을 넘기기

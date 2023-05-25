---
title: 'JWT도 함정은 있다!'
description: '세션 인증방식과 토큰 인증방식의 트레이드오프를 살펴보고 JWT의 취약점에 대해서 알아보자'
coverImage: ''
image: ''
date: '2023-02-03'
path: 'pitfalls-of-jwt'
category: '인증방식'
tags:
  - 세션
  - 토큰
  - 인증방식
---

### 들어가기에 앞서

먼저 로그인을 구현하는 인증방식으로 Session(세션인증)과 JWT(토큰인증)가 있습니다.
비교적 최신에 나온 JWT는 많은 기술 블로그에서도 소개가 되면서 무조건 기본으로 채택하는 경우가 있습니다.
그런데 정말 JWT가 좋으니깐 기본으로 채택해야 할까요?

<br />

먼저 세션 - 토큰 인증방식의 트레이드오프를 살펴보기 위해 각 특징에 대해서 간단히 살펴보고자 합니다.

# 1. 세션(서버)기반 인증방식

: 서버나 DB에 사용자 인증정보 저장하는 방식

- 사용자가 로그인을 하면 인증정보를 서버의 세션 저장소에 저장하고 사용자에게 식별자로 Session ID를 발급해주게 됩니다. 식별자인 Session ID는 쿠키로 저장되어 전송,전달하지만 실제 중요한 인증정보는 서버나 DB에 저장되어 있습니다.

#### 장점

- 프론트엔드측의 인증이 쉬워진다.
- 보안 측면에서 조금 유리
  서버에서 인증정보를 관리하기 때문에 만약 해커가 세션 ID를 탈취하더라도 서버에서 해당 세션을 무효화하여 로그아웃시키면 됩니다.

#### 단점

- 확장성 문제로 서버측 비용 증가
  사용자가 증가하게 되면 많은 트래픽을 처리해야 되므로 그만큼 DB 리소스가 더 필요해지게 됩니다. 그래서 서버 확장하거나 세션 분산 설계가 복잡해진다는 문제가 있습니다.

# 2. 토큰기반 인증방식

: 클라이언트 측에 사용자 인증정보 저장하는 방식

#### 장점

- 서버의 무상태성
  클라이언트측에 토큰을 저장되기때문에 유저의 정보를 서버에 저장해두지 않습니다. 서버는 토큰 해독 여부만 판단하게 됩니다.
- 서버 확장에 용이
  서버가 무상태성을 가지게 되면서 서버 메모리 과부화에 대한 문제가 해결되고 사용자가 늘어나도 확장에 용이해지게 됩니다.

## 토큰방식의 함정

### 1. 크기 문제

세션은 쿠키에 세션 ID만을 담아 전송하기 때문에 트래픽이 적게 사용됩니다. [참고 글](https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens#size)에서의 비교를 보면 세션의 크키는 6 byte인 반면, JWT(최소한의 정보-`iss`, `sub`, `nbf`, `exp`, `ìat`, `jti`, `typ`)는 304 byte로 세션보다 약 50배 이상의 크기를 보유하고 있습니다.
따라서 JWT가 상대적으로 크기 때문에 쿠키에서 사용될 때, 요청 당 오버헤드가 발생될 수 있다는 점이 있습니다.

### 2. 서버에서 로그아웃 제어 불가

만약 해커가 토큰을 탈취했다고 한다면, 토큰이 만료되지 않는 한 해커는 서버에 요청을 할 수 있게 됩니다. 그리고 서버의 무상태성 특징때문에 토큰이 탈취돼도 로그아웃을 강제로 못하는 문제가 있습니다.
이러한 문제를 보안하기 위해서 다음의 작업들을 수행할 수도 있습니다.

#### 1. access 토큰 짧은 만료기한 지정

: 짧은 만료기한을 줘서 탈취돼도 오래 사용하지 못하도록 합니다.

- **단점**
  만료되기 전까지 해커가 요청을 보내게 된다는 점이 있고,
  사용자가 매번 로그인해야되므로 편의성이 안좋아지는 단점이 생깁니다.

#### 2. refresh 토큰 긴 만료기한 사용

: 로그인을 유지하기 위해 access 토큰 발급받기 위한 긴 만료기한을 가진 토큰입니다. access의 짧은 만료기한으로 사용자가 매번 로그인하지 않도록 refresh가 있다면 갱신할 수 있도록 처리합니다.

- **단점**
  - access 만료기한 짧기 때문에 refresh 요청이 증가됩니다.
  - 만약 해커가 refresh 토큰을 탈취했다면 문제가 심각해집니다. 그래서 보안이 중요한 서비스에서는 refresh 토큰을 사용하지 않기도 합니다.

> #### Q) refresh 토큰이 탈취돼서 이를 로그아웃을 시키기 위해 서버 저장소를 두게 된다면?
>
> A) refresh 토큰 검증을 위해 중앙 집중식 저장소가 필요하게 된다. 그렇다면 서버 저장소, 클라이언트 저장이 필요해지면서 JWT의 최대 장점이었던 무상태성이 무효화됩니다. 따라서 세션과 유사한 방식으로 관리하게 됩니다.

<br/>

### 3. 클라이언트 측의 토큰 저장위치로 인한 보안문제

브라우저의 웹 저장소(LocalStorage, SessionStorage)나 쿠키에 토큰을 저장하게 되면 XSS, CSRF 공격에 취약하다는 문제가 발생합니다.

#### 1. LocalStorage | SessionStorage 저장 시

저장하는 방법이 편리하긴 하지만 자바스크립트에서 `document.cookie`으로 접근이 가능하게 되면서 XSS(Cross Site Scripting) 공격에 취약하게 되므로 비권장됩니다.

#### 2. Cookie 저장 시

쿠키에 옵션을 주면 XSS, CSRF 공격에 조금 안전해질 수 있습니다.

- 옵션
  - `httpOnly` : XSS 공격에 조금 안전 (JS에서 `document.cookie`로 접근 불가)
  - `secure=true` : `HTTPS` 일때만 쿠키 전송가능
  - `sameSite=strict` : **CSRF(Cross-Site Request Forgery 사이트 간 요청 위조)** 방지.
    같은 도메인일때만 쿠키 전송가능
    - `lax`
      명시안하면 적용되는 기본값. GET 요청에선 쿠키 전송가능. 다른 도메인으로 쿠키 전송불가
    - `none`
      도메인 달라도 항상 쿠키 전송가능. `secure` 옵션 붙여야 작동함
    - `strict`
      동일 도메인일때만 쿠키 전송가능

<br/>

> **😱 쿠키 secure 설정 시 주의사항**
>
> - 같은 도메인이더라도 `(FE 로컬)http - (서버)https` 환경에서는 refresh 쿠키 전달 못받음.
>   서로 scheme이 달라서 다른 사이트로 인식한다. FE 로컬에서 작업할 때는 [추가 작업](https://velog.io/@yaytomato/React-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-https%EB%A1%9C-%EB%A1%9C%EC%BB%AC-%ED%85%8C%EC%8A%A4%ED%8C%85%ED%95%98%EA%B8%B0)이 필요하다.

> **😱 쿠키 sameSite 설정 시 주의사항**
>
> - BE 서버가 FE와 같은 도메인일때만 사용가능.
>   배포환경은 BE-FE 같은 도메인이라 괜찮지만
>   개발환경에서 BE, FE가 다르면 크로스도메인 이슈 발생
>
> - 추가 세팅 필요
>   도메인이 서로 다르면 서버에서 cors header를 설정하거나 refresh 토큰 요청을 인증된 사이트에서만 하도록 세팅해줘야한다.
>   FE에서 `axios.defaults.withCredentials = true;` 설정도 필요하다.

<br/>

#### 각 토큰의 저장 위치는?

1. access 토큰 저장소 - 로컬 변수로 저장

   - 변수에 저장해서 XSS, CSRF공격으로부터 안전.
   - 단, 새로고침하면 변수가 없어지므로 refresh로 재갱신 받는 요청을 수행해야 합니다. (slient refresh)

2. refresh 토큰 - `secure httpOnly sameSite` 쿠키에 저장
   - `httpOnly`- XSS에 조금 안전
   - `secure` - HTTPS으로만 접속 가능
   - `sameSite=strict`- CSRF에 조금 안전

#### JWT 전달방식 정리

1. 로그인 요청 성공 시, 응답으로 Access(짦은 유효기한) 발급받고 쿠키로 Refresh(긴 유효기한) 토큰을 발급받기.
2. Refresh는 서버에서 `httpOnly secure sameSite` 옵션 설정한 쿠키로 저장하여 전송.
3. Access는 클라이언트에서 로컬 변수에 저장하고, 권한 필요한 요청마다 Authorization 헤더에 `Bearer ${accessToken}`의 규격으로 전송.
4. slient refresh로 Access 재발급 후 갱신하기

- Access 만료 시)
  쿠키에 Refresh가 이미 담겨진 상태로 요청마다 전송되어서 refresh로 재발급받는 API(`/refresh`)에 요청하고 응답으로 Access 받아서 갱신하기
- 새로고침 시)
  변수로 저장한 Access가 없어져서 재발급을 받아야 함.
  쿠키에 Refresh가 이미 담겼기 때문에 refresh로 재발급받는 API(`/refresh`)에 요청하고 응답으로 Access 받아서 갱신하기

5. Refresh 만료 시 재발급 후 갱신하거나 or 로그아웃 시키는 로직으로 구현

#### 추가 참고사항

- 강제 로그아웃을 위해 refresh를 서버에 저장할 수 있습니다.
- 단, JWT에서 서버의 무상태성이란 장점은 무효화되고 세션과 비슷하게 관리하게 됩니다.

<br/><br/><br/><br/>

---

<br/><br/>

# 마치며

결국 상황에 맞게 고려해서 방식을 채택해야 합니다. 서비스의 규모, 동시 접속자 수, 보안이 중요한 서비스 등등 상황들을 따져보고 선택하거나 두가지 인증 방식을 결합하여 구현할 수도 있습니다.
각각의 트레이드 오프가 무엇인지 확인해보면서 전통적인 방식의 세션과 비교적 최신방식의 토큰 중 상황에 맞춰서 선택할 필요가 있습니다.
<br/>
따라서 JWT를 무조건 깃헙의 템플릿(보일러플레이트)에 기본으로 구성한다던지 앞으로의 프로젝트에 사용할 지는 충분히 고민을 해 본 후에 적용하는 것이 적절하다고 생각했습니다.
<br/>
만약, 보안이 중요한 서비스에서 강제 로그아웃을 구현해야한다면 서버의 refresh 저장소 구축에 대해서는 결국 세션과 유사한 방식이 되기 때문에 이렇게 된다면 그냥 세션을 사용하면 되지 않을까라는 생각이 들었습니다.
또한 여기서 소개한 방법들이 모두 완벽한 정답은 아니므로 참고한다는 의미로 봐주시고 혹시나 잘못된 정보가 있었다면 자유롭게 댓글로 남겨주시면 감사하겠습니다.

---

<br/><br/><br/><br/>

# 참조

- [JWT should not be your default for sessions](https://evertpot.com/jwt-is-a-bad-default/)
- [LocalStorage vs. Cookies: All You Need to Know About Storing JWT Tokens Securely in the Front-End](https://codeburst.io/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-70dc0a9b3ad3)
- [🍪 프론트에서 안전하게 로그인 처리하기 (ft. React)](https://velog.io/@yaytomato/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%90%EC%84%9C-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0#%F0%9F%A7%9E%E2%99%82%EF%B8%8Ftldr)
- [[프로젝트] Refresh Token 적용하기](https://pomo0703.tistory.com/208#recentComments)
- [Access Token과 Refresh Token을 어디에 저장해야 할까?](https://velog.io/@ohzzi/Access-Token%EA%B3%BC-Refresh-Token%EC%9D%84-%EC%96%B4%EB%94%94%EC%97%90-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C#%EA%B8%B0%ED%98%B8-1%EB%B2%88-%EB%A1%9C%EC%BB%AC-%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80-or-%EC%84%B8%EC%85%98-%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80)
- 로그아웃 관련 참고 - [SpringBoot + Jwt를 이용한 로그아웃](https://velog.io/@joonghyun/SpringBoot-Jwt%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83)

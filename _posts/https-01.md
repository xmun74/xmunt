---
title: 'HTTPS와 TLS'
description: 'HTTPS 동작원리와 TLS 핸드셰이크 과정에 대해서 살펴보도록 하겠습니다'
coverImage: '/images/posts/https-01/250302-234050.png'
image: ''
date: '2025-03-02'
path: 'https-01'
category: 'HTTPS'
tags:
  - HTTPS
---

<br /><br />

# HTTPS란?

HTTPS란 HTTP(Hypertext Transfer Protocol) 통신과정에서 보안을 강화한 프로토콜입니다. 웹 사이트 URL에 `http://`가 아닌 `https://`가 붙은 경우 HTTPS를 사용하고 있음을 확인할 수 있습니다.
HTTP는 보안을 고려하지 않았기 때문에 요청이 평문으로 노출됩니다. 그래서 `스니핑`과 같은 해킹기법으로 신용카드 정보나 비밀번호 등 중요한 정보를 가로챌 수 있습니다. 이러한 보안 문제를 해결하기 위해서 HTTPS가 도입되었으며, TLS(또는 SSL)를 사용하여 HTTP 요청과 응답을 암호화함으로써 보안이 강화된 통신 환경을 제공하게 됐습니다. 예를 들어, 위치 정보 데이터를 조회하는 [HTML5 Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) 같이 민감한 개인정보를 제공하는 기능은 HTTP에서 지원하지 않고 HTTPS환경에서만 지원되는 것을 확인할 수 있습니다.

<br />

TLS(Transport Layer Security:전송 계층 보안) 또는 SSL(Secure Sockets Layer:보안 소켓 계층)이라 불리는 이 프로토콜은 1995년 SSL 2.0이 처음 공개됐으며 이후 1999년 TLS가 등장했습니다. TLS는 SSL의 보안 취약점을 개선해서 등장했기 때문에 SSL은 이제 TLS로 대체되었습니다. 하지만 `SSL`이라는 명칭을 많이 사용했기 때문에 여전히 TLS와 SSL이라는 용어가 함께 사용되고 있습니다.

<br /><br /><br />

# 대칭키, 비대칭키, 하이브리드 암호화

먼저 동작원리를 살펴보기에 앞서서 대칭키, 비대칭키를 알아보도록 하겠습니다.
암호화 과정은 민감한 데이터를 암호화하고 권한있는 사용자가 데이터를 해독하도록 복호화 하는 과정을 말합니다.

<br />

![](https://velog.velcdn.com/images/xmun74/post/be07c0f6-0874-45bb-83b4-218a0ad7494c/image.png)

#### 대칭키 방식

동일한 1개의 키를 사용하여 암호화 및 복호화를 수행하는 방식입니다.

- 장점: 간단한 구조로 구현에 용이하며 속도가 빠름
- 단점: 원거리일때 안전하게 키 교환하는 것이 어려움, 키 유출될 경우 보안 문제 발생

<br />

![](https://velog.velcdn.com/images/xmun74/post/7d2243ec-26c2-46fa-98ab-f77a547f9818/image.png)

#### 비대칭키 방식

공개키(Public key)와 개인키(비밀키 Private key) 2개 키를 사용하는 방식입니다. Server는 공개키, 개인키로 key pair 쌍을 만듭니다. 그리고 공개키는 모두가 가질 수 있도록 배포하고 비밀키는 서버 자신만 보도록 보관합니다.이후 Client는 누구나 획득할 수 있는 Server의 공개키를 가지고 암호화하여 전송하고 Server는 자신만이 가진 개인키로 데이터를 복호화합니다.

- 장점: 대칭키보다 안전하게 키 교환하고 관리하기 쉬움, 확장성 높음
- 단점: 속도가 느리고 연산 복잡성 증가

<br />

![](https://velog.velcdn.com/images/xmun74/post/eb38964d-14c7-46f9-8f19-b8715cf02dc1/image.png)

#### 하이브리드 방식

대칭키와 비대칭키를 결합하여 장점을 활용하는 시스템입니다. 이렇게 대칭키 방식으로 빠른 속도를 유지하고 비대칭키의 장점으로 키 교환/관리 보안성 문제를 해결합니다. 이는 TLS/SSL 프로토콜에서 사용됩니다.

1. Server는 공개키, 개인키 키페어를 생성해서 공개키를 Client에 전송합니다.
2. Client는 Server의 공개키로 대칭키를 암호화하여 전송합니다.
3. Server는 개인키로 대칭키를 복호화합니다. 따라서 대칭키가 양쪽에 있게 됩니다.
4. Client는 대칭키로 암호화하여 데이터 전송합니다.
5. Server는 대칭키로 데이터를 복호화합니다.

<br /><br /><br /><br />

---

# TLS Handshake 과정

![250302-234050](/images/posts/https-01/250302-234050.png)

- [사진 참고](https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/)

다음으로 TLS Handshake 과정을 살펴보도록 하겠습니다. 위 사진에서 파란색 부분은 TCP 3-way handshake로 SYN, SYN ACK, ACK 연결하는 과정입니다. 그리고 노란색 부분의 패킷은 TLS handshake입니다. TCP 3-way handshake을 통해서 TCP 연결이 된 이후에 발생합니다. 이어서 노란색 부분인 TLS handshake 과정을 차례대로 보도록 하겠습니다.

#### 1. Client Hello

클라이언트가 서버에 연결을 시도하는 패킷입니다.
클라이언트의 TLS/SSL 버전 정보, 클라이언트가 지원하는 Cipher Suites(암호화 방식), 클라이언트에서 생성된 Random byte(난수) 등을 전달합니다.

> **Cipher Suites 구조** ([사진 참고 - microsoft](https://learn.microsoft.com/en-us/windows/win32/secauthn/cipher-suites-in-schannel))
> ![](https://velog.velcdn.com/images/xmun74/post/c496f9b2-04a4-4d2a-b76c-a7d3fcd95d16/image.png)
>
> - TLS: 프로토콜명
> - key exchange: 클라이언트-서버 간 대칭키 교환할 방식
> - signature: 클라이언트-서버 간 교환한 인증서 검증 알고리즘
> - bulk encryption: 클라이언트-서버 간 교환되는 대칭키 암호 알고리즘
> - message authentication: 암호화된 메시지의 무결성을 보장하는 MAC 또는 HMAC 생성

#### 2. Server Hello

앞선 Client Hello에 대해서 서버가 응답하는 패킷입니다.
서버 자신의 TLS/SSL 버전정보, 서버에서 생성한 난수, 클라이언트가 보낸 Cipher Suites중에서 서버가 사용 가능한 암호화 방식을 1개 선택하여 보냅니다.

#### 3. Certificate

서버 자신의 TLS/SSL 인증서를 클라이언트에 전송합니다.
인증서에는 서버가 생성한 공개키가 담겨 있습니다.
클라이언트는 서버의 인증서가 무결한지 검증합니다. 그리고 이전에 주고받은 클라이언트와 서버 각각의 난수로 대칭키를 생성합니다. 그리고 이 대칭키를 인증서 안에 있던 서버의 공개키로 암호화합니다.

#### 4. Server Hello Done

서버의 메시지 전송이 마쳤다는 것을 의미하는 작업입니다.

#### 5. Client Key Exchange

클라이언트는 인증서에서 추출한 서버의 공개키로 대칭키를 암호화하고 해당 대칭키를 전송합니다.

#### 6. Change Cipher Spec / Finished

클라이언트와 서버 서로가 이후 전송되는 메시지를 협상된 암호화 알고리즘과 키를 사용하여 암호화하겠다는 사실을 알리는 패킷입니다. 그리고 Finished 패킷을 보내서 TLS/SSL handshake를 종료하여 마칩니다.

<br /><br /><br /><br />

# 마치며

이전에 평문으로 전송되던 HTTP의 보안 문제를 해결하기 위한 등장한 HTTPS에 대해서 알아보았습니다. HTTPS는 TLS/SSL를 통해서 요청과 응답을 암호화하고 이로써 중간가공격이나 스니핑 해킹에 대해서 보안을 강화할 수 있습니다. 그리고 TLS 핸드셰이크 과정을 통해서 클라이언트와 서버가 안전하게 대칭키를 공유하고 암호화된 데이터를 전송할 수 있게 됐습니다. 만약 중간 네트워크에서 패킷이 가로채지더라도 데이터를 해독하기 어렵게되어 내용을 알 수 없게 됩니다. 따라서 암호화를 통해 보안을 강화한 HTTPS와 동작원리에 대해서 이해할 수 있었습니다.

---

<br /><br /><br /><br />

# 참고

- [HTTPS란 무엇입니까? - cloudflare](https://www.cloudflare.com/ko-kr/learning/ssl/what-is-https/)
- [TLS 핸드셰이크의 원리는 무엇일까요? | SSL 핸드셰이크 - cloudflare](https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/)

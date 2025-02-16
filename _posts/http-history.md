---
title: 'HTTP 버전 별 역사'
description: 'HTTP가 발전해온 과정에 대해서 알아보기 위해 버전 별로 정리해보겠습니다.'
coverImage: '/images/posts/http-history/250216-233528.png'
image: ''
date: '2025-02-16'
path: 'http-history'
category: 'HTTP'
tags:
  - HTTP
---

<br/><br/><br/><br/>

HTTP(Hyper Text Transfer Protocol)는 웹 브라우저와 웹 서버 간에 통신을 위한 프로토콜(규약)로, 1989년에 팀 버너스리에 의해 처음 제안됐습니다. 웹 브라우저가 서버에 HTML 문서나 사진 등의 리소스를 요청하면, 서버는 필요한 문서를 응답으로 전달하게 식으로 동작합니다.
HTTP 최초의 버전은 v0.9로 시작하여 가장 최신버전은 v3입니다. HTTP는 버전이 발전될수록 성능과 보안이 향상되었으며, 각 버전별로 어떤 특징이 있는지 살펴보겠습니다.

<br/><br/><br/><br/>

# HTTP 역사

1. HTTP/0.9 - 1991년(최초 버전)
2. HTTP/1.0 - 1996년
3. HTTP/1.1 - 1997년(표준)
4. HTTP/2.0 - 2015년
5. HTTP/3.0 - 2021년

<br/><br/><br/><br/>

## 1. HTTP/0.9

최초의 버전은 사실 버전이 없었기 때문에 v0.9 시점에서 이후에 생겨난 버전과 구분하기 위해 v0.9버전을 붙이게 됐습니다.

#### 특징

- 요청은 단일 라인
- GET 메서드만 존재
- HTTP 헤더가 없어서 HTML 외 다른 유형의 문서를 전달할 수 없었음

```jsx
/* 요청 */
GET /helloworld.html

/* 응답 */
<html>
  hello world !
</html>
```

<br/><br/>

## 2. HTTP/1.0

#### 특징

- 요청에 `버전 정보`가 포함됨
- 요청 메서드가 `GET, HEAD, POST` 추가됨
- 응답 시작부분에 `Status Code` 추가되어 성공/실패 여부 확인 가능
- 요청과 응답에 `HTTP 헤더` 포함되어 메타데이터 전송 가능해짐
- `Content-Type`이 추가되면서 HTML 문서 외 다른 문서도 전송 가능해짐

#### 단점

- 1개 요청마다 TCP 연결 새로 생성해야함
  : 1개 웹 페이지에서 다수의 HTTP 리소스 요청할 때마다 TCP handshake 과정을 거쳐야 해서 속도가 느려지게 되는 단점이 발생합니다.

```
/* 요청 */
GET /myimage.gif HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

/* 응답 */
200 OK
Date: Tue, 15 Nov 1994 08:12:32 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/gif
(image content)

```

<br/><br/>

## 3. HTTP/1.1

표준화 작업의 대상이 된 버전으로 1996년 11월에 발표된 1.0 버전에서 몇 달 뒤인 1997년 1월에 발표됐습니다.

#### 특징

- Persistent Connection(연결 유지)
  : 지정된 timeout 동안 연결 재사용 가능해집니다. 1.0에서 요청에 대한 응답이 오면 TCP 연결이 종료되는 한계를 개선하기 위해 추가되었습니다.
- Pipelining 추가
  : 여러 요청을 처리할 때 앞순서의 응답을 기다리고 요청하는 것이 아니라 여러 요청을 한꺼번에 전송할 수 됐습니다. 그래서 통신 지연 시간이 단축됐습니다.
- Chunked Transfer Encoding
- Cache-Control
- Host 헤더 추가
  : 한 개의 IP에 여러 도메인을 호스트할 수 있게 가능해졌습니다.
- 메서드 `OPTIONS, PUT, DELETE, TRACE` 추가

#### 단점

- HOL(Head Of Line) Blocking
  : 앞 요청의 응답이 Blocking되어 너무 오래걸리면 뒷순서의 응답도 늦어지는 HOLB 문제가 발생합니다.
- Header 구조 중복
  : 헤더값이 중복되더라도 똑같은 내용으로 다시 요청해야하는 문제가 있습니다.

<br/><br/>

## 4. HTTP/2.0

#### 특징

- Binary Framing 계층 추가
  : Text 형식의 메시지를 프레임단위로 나누고 Binary로 인코딩하여 데이터 전송합니다.
- Header 압축
- Multiplex Streaming
  ![250216-233528](/images/posts/http-history/250216-233528.png)
  : 하나의 TCP 연결에서 동시에 여러 요청을 병렬로 처리할 수 있게 됐습니다. TCP 연결을 Stream, Message, Frame 단위로 세부화합니다. 각 스트림이 하나의 프레임을 전송하고, 하나의 연결에서 여러 스트림을 가지게 되면서 동시에 여러 요청을 처리할 수 있게 됩니다. 이후 클라이언트 측에서 받은 데이터를 다시 조립하여 사용합니다. 이 다중화 덕분에 HOLB 문제를 해결할 수 있게 됩니다.
- Stream Prioritization : 리소스 우선순위 설정 가능

<br/><br/>

## 5. HTTP/3.0

TCP로 인해 발생하는 문제를 해결하기 위해 전송계층에서 TCP 대신 `QUIC`라는 프로토콜을 사용합니다.

#### QUIC(Quick UDP Internet Connections)란?

구글의 짐 로스킨드가 설계한 전송계층 통신 프로토콜입니다. TCP에서 신뢰성을 유지하기 위한 기능들을 UDP 기반으로 구현했습니다. 신뢰가 보장되지 않던 UDP 위에 혼잡제어, 흐름제어 등의 작업을 하는 QUIC 계층을 추가하여 신뢰성을 제공합니다.

<br/><br/>

- [RFC 1945](https://datatracker.ietf.org/doc/html/rfc1945)
- [RFC 2068](https://datatracker.ietf.org/doc/html/rfc2068)
- [HTTP의 진화 - MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Evolution_of_HTTP)

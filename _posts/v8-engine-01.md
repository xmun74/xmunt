---
title: 'JavaScript는 어떻게 실행될까? V8 엔진의 단계별 작동 원리'
description: 'V8 엔진의 파싱, Ignition, Sparkplug, TurboFan까지 핵심 흐름에 대해서 살펴봅시다. '
coverImage: '/images/posts/v8-engine-01/241123-223547.png'
image: ''
date: '2024-11-23'
path: 'v8-engine-01'
category: 'JavaScript'
tags:
  - V8
---

# V8 엔진

- C++로 작성된 자바스크립트 엔진 ([v8 github](https://github.com/v8/v8/tree/main))
  자바스크립트 엔진에는 v8 외에도 Firefox (SpiderMonkey), Safari (JavaScriptCore), Microsoft Edge (Chakra 기반이었지만 최근 [Chromium](https://support.microsoft.com/en-us/microsoft-edge/download-the-new-microsoft-edge-based-on-chromium-0f4a3dd7-55df-60f5-739f-00010dba52cf), V8을 사용하여 다시 만들어짐) 등이 있습니다.
- Chrome과 Node.js 등에서 사용된다.
- JS 코드를 파싱하고 실행합니다.
- 실행 속도를 높이기 위해 JIT(Just In Time)컴파일러를 사용한다.

<br /><br /><br />

---

<br /><br /><br />

## 파이프라인

- 이전 파이프라인 [사진 출처](https://medium.com/@minhaz217/lets-understand-the-javascript-just-in-time-compiler-jit-and-how-the-v8-engine-works-ff6276d131a1)

  - ![](https://velog.velcdn.com/images/xmun74/post/1f4fa42f-4351-47b1-9e90-9f921c76f6e3/image.png)

- 최신 파이프라인 [사진출처](https://medium.com/@yanguly/sparkplug-v8-baseline-javascript-compiler-758a7bc96e84)
  - ![](https://velog.velcdn.com/images/xmun74/post/52b0873d-fe19-41cd-945e-4dcb8f47372f/image.png)

#### 1. Parsing

- JavaScript 코드를 -> AST(Abstract Syntax Tree:추상구문트리로)로 변환
  코드를 컴퓨터가 쉽게 이해하도록 구조화하는 작업입니다.

#### 2. Ignition으로 Byte code 생성

- 가상머신에서 실행되며 이때 인터프리터가 작동됨

#### 3. Sparkplug(비최적화 컴파일러)로 기계어 생성

- 비최적화된 컴파일러로 바이트코드를 네이티브 코드(기계어)로 변환

#### 3. TurboFan(성능 최적화 컴파일러)로 기계어 생성

- JIT 컴파일러 사용해서 바이트코드를 네이티브 코드(기계어)로 변환후 실행

#### 4. 실행

- 비최적화된 상태로 실행하거나 or 성능최적화 작업 후 실행

<br /><br />

### 파이프라인의 변경

- ~2017 : Full-codegen + Crankshaft (+이그니션 + 터보팬)

  - [사진출처](https://v8.dev/blog/ignition-interpreter) ![](https://velog.velcdn.com/images/xmun74/post/e77dd87e-c8ec-42b0-8e00-f47b58c5954f/image.png)

- 2017~2021 : 이그니션 + 터보팬

  - ![](https://velog.velcdn.com/images/xmun74/post/28911015-48f5-49d1-b2c1-946fa792f6e5/image.png)

- 2021년 V8 v9.1 변경된 파이프라인 : 이그니션 + 스파크 플러그 + 터보팬 ([사진출처-v8](https://v8.dev/blog/sparkplug))
  - ![](https://velog.velcdn.com/images/xmun74/post/a8b0f6bf-bd50-4658-87cf-be50cbeed96f/image.png)

---

## 1. JS를 AST로 파싱 : 코드 구조 이해하기

사람이 작성한 JS 코드를 컴퓨터가 이해할 수 있도록 계층적 구조로 만들어줘야 합니다.

```js
let x = '문자열' // 지금은 문자열 String
x = 1 // 이제는 숫자 Number
```

그리고 JS는 동적 언어이기 때문에 실행중에 타입이 바뀌기도 합니다. 실행 전에 타입을 고정하기가 어렵습니다. 이러한 JS의 복잡한 동작을 처리하기 위해서는 먼저 코드 구조를 파악해야합니다. 코드를 실행하기 전에 구문 분석하기 위해서 AST 구조로 변환해두게 됩니다. 타입 정보는 이후 코드를 실행할 때 동적으로 학습하게 됩니다.

- JS코드

```js
const name = '유재석'
```

- AST 파싱 후

```json
{
  "type": "Program",
  "start": 0,
  "end": 19,
  "body": [
    {
      "type": "VariableDeclaration", // 변수 선언
      "start": 0,
      "end": 19,
      "declarations": [
        {
          "type": "VariableDeclarator", // 대입문
          "start": 6,
          "end": 18,
          "id": {
            "type": "Identifier", // 변수 식별자
            "start": 6,
            "end": 10,
            "name": "name"
          },
          "init": {
            "type": "Literal", // 리터럴 값
            "start": 13,
            "end": 18,
            "value": "유재석", // 실제 값
            "raw": "'유재석'"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

([v8/src/parsing/parser.cc](https://github.com/v8/v8/blob/main/src/parsing/parser.cc) 파일을 사용하여 파싱이 이뤄짐)

<br /><br />

---

## 2. Ignition interpreter로 Byte code로 변환하기

- [이미지 출처 - v8](https://v8.dev/blog/background-compilation)
  ![](https://velog.velcdn.com/images/xmun74/post/55e235c0-1763-480e-b152-4ce4c86ac7d0/image.png)

: 코드 한줄 실행할때마다 AST를 받아서 바이트코드로 반환해주는 인터프리터

- **메모리 사용량을 감소**하기 위해 컴파일러가 아닌 인터프리터를 사용
  : 컴파일러는 실행되지 않을 코드까지 네이티브 코드(기계어)로 변환해서 메모리 낭비가 발생하지만,
  인터프리터는 바이트코드로 변환하기 때문에 용량도 작고, 한 줄씩 실행될때마다 변환하여 메모리 사용이 효율적입니다.

- 파싱 오버헤드 감소하여 **초기 실행속도 높임**
  : 초기에 코드 실행 시 복잡한 네이티브코드 생성이나 최적화를 건너뛰고, 빠르게 바이트코드를 사용해서 실행합니다.
  그리고 실행되지 않을 가능성이 있는 코드(함수내부, 조건문 등)은 미리 작업하지 않고 필요할때만 작업을 수행합니다.

  ```js
  function foo() {
    console.log('Hello!')
  }
  // 함수가 호출되지 않으면 내부코드를 바이트코드로 미리 파싱하지 않음 - 오버헤드 줄임
  foo() // 호출해야 바이트코드로 파싱
  ```

- 이전 방식이었던 Full-codegen 대체하는 인터프리터

  > 마지막으로 바이트코드를 생성하는 것이 Full-codegen의 기준 컴파일된 코드를 생성하는 것보다 빠르기 때문에 Ignition을 활성화하면 일반적으로 스크립트 시작 시간이 개선되고 결과적으로 웹 페이지 로드도 개선됩니다.
  >
  > - [v8 Launching Ignition and TurboFan ](https://v8.dev/blog/launching-ignition-and-turbofan)

- 터미널에서 바이트코드 출력해보기
  코드를 바이트코드로 보고 싶으면 `node --print-bytecode index.js`를 실행해보면 확인할 수 있습니다.

<br /><br />

---

## 3. Sparkplug 비최적화 컴파일러 도입

: 터보팬과 달리 최적화를 수행하지 않고 바이트코드를 -> 기계어 코드로 빠르게 생성하는 컴파일러

- 이그니션 - 터보팬의 중간단계인 **비최적화 컴파일러**
- 바이트코드 기반으로 네이티브코드(기계어) 생성하므로 속도가 빠름
- 터보팬에 비해서 최적화 작업을 생략하기 때문에 메모리 사용량 적음(최적화는 터보팬에 맡김)
  너무 섣부린 최적화로 인한 비용이 발생하기 때문에 이러한 간극을 줄이고자 심플한 비회적화 컴파일러를 도입하게 됩니다.

## 4. 필요시 Turbofan compiler로 성능 최적화

: 바이트코드를 머신코드로 변환하는 컴파일러

- 바이트코드를 분석해서 JIT 컴파일러로 성능 최적화 작업을 수행합니다.
- 터미널에서 최적화 코드 로그 출력해보기
  `node --trace-opt index.js`

<br/><br/><br/><br/>

> #### 자동차 엔진의 구조를 메타포로 사용한 용어 설명

- V8
  : 자동차에서 v자 형태의 8기통 고성능 엔진인 [v8](https://en.wikipedia.org/wiki/V8_engine)의 이름을 따서 만들었음
  ![241123-223547](/images/posts/v8-engine-01/241123-223547.png)

- Ignition(점화)
  : 엔진을 가동시키는 점화 작업
- TurboFan
  : 고성능 가속 작업
  : 성능 최적화를 위해 자주 실행되는 핫코드를 네이티브 머신 코드로 변환하는 JIT 컴파일러.

<br /><br />

<br /><br />

---

# 참고

- [V8 github](https://github.com/v8/v8)
- https://v8.dev/docs/source-code
  설치해서 빌드하고 소스코드 보는 사이트
- https://evan-moon.github.io/2019/06/28/v8-analysis/
- [BlinkOn 6 Day 1 Talk 2: Ignition - an interpreter for V8](https://www.youtube.com/watch?v=r5OWCtuKiAk)

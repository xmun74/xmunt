---
title: 'JavaScript 실행하기 전 과정: V8 엔진의 작업 흐름'
description: 'V8 엔진의 파싱, Ignition, Sparkplug, TurboFan까지 핵심 흐름에 대해서 살펴봅시다.'
coverImage: '/images/posts/v8-engine-01/241123-223547.png'
image: ''
date: '2024-11-23'
path: 'v8-engine-01'
category: 'JavaScript'
tags:
  - V8
  - JavaScript
---

# V8 엔진이란?

C++로 작성된 Google의 오픈소스 **자바스크립트 및 WebAssembly 엔진**입니다. 오픈소스이기 때문에 [v8 github](https://github.com/v8/v8/tree/main)에서 소스코드를 확인할 수 있습니다.
물론 자바스크립트 엔진에는 v8 외에도 Firefox (SpiderMonkey), Safari (JavaScriptCore), Microsoft Edge (Chakra 기반이었지만 최근 [Chromium](https://support.microsoft.com/en-us/microsoft-edge/download-the-new-microsoft-edge-based-on-chromium-0f4a3dd7-55df-60f5-739f-00010dba52cf), V8을 사용하여 다시 만들어짐) 등이 있습니다.
Chrome과 Node.js 등에서 사용되고, 자바스크립트 코드를 파싱하고 실행합니다. 또한 실행 속도를 높이는 등의 최적화 작업을 수행하기 위해서 JIT(Just In Time)컴파일러를 사용하고 있습니다.

<br /><br /><br />

---

<br /><br /><br />

## 파이프라인

V8 엔진의 작업흐름을 전체적으로 파악하기 위해서 파이프라인을 살펴보도록 하겠습니다. 그런데 파이프라인의 역사?도 조금씩 변경된 부분들이 있어서 간단하게 살펴보고 넘어가겠습니다.

#### 파이프라인의 변경

- 2017년 이전 : Full-codegen + Crankshaft (+Ignition +TurboFan)
  이후에 Ignition과 TurboFan로 대체되게 됩니다. [(사진출처)](https://v8.dev/blog/ignition-interpreter)

  - ![](https://velog.velcdn.com/images/xmun74/post/e77dd87e-c8ec-42b0-8e00-f47b58c5954f/image.png)

- 2017~2021년 : Ignition + TurboFan [(사진출처)](https://docs.google.com/presentation/d/1OqjVqRhtwlKeKfvMdX6HaCIu9wpZsrzqpIVIwQSuiXQ/edit#slide=id.g1453eb7f19_0_391)

  - ![](https://velog.velcdn.com/images/xmun74/post/28911015-48f5-49d1-b2c1-946fa792f6e5/image.png)

- 2021년(v9.1부터 변경된 파이프라인) : Ignition + `Sparkplug` + TurboFan [(사진출처)](https://v8.dev/blog/sparkplug)

  - 중간에 Sparkplug가 추가되었습니다. ![](https://velog.velcdn.com/images/xmun74/post/a8b0f6bf-bd50-4658-87cf-be50cbeed96f/image.png)

---

- [(사진출처)](https://medium.com/@yanguly/sparkplug-v8-baseline-javascript-compiler-758a7bc96e84)![](https://velog.velcdn.com/images/xmun74/post/52b0873d-fe19-41cd-945e-4dcb8f47372f/image.png)

이렇게 가장 최신의 파이프라인을 가지게 되었고 밑 내용대로 작업이 이뤄지게 됩니다.

#### 1. JS 코드 -> AST로 Parsing

- JavaScript 코드 -> AST(Abstract Syntax Tree: 추상구문트리로)로 파싱
  코드를 컴퓨터가 쉽게 이해하도록 구조화하는 작업입니다.

#### 2. Ignition(인터프리터)으로 Byte code 생성

- AST를 바탕으로 바이트코드(Byte code)를 생성합니다.
- 가상머신에서 실행되며 이때 인터프리터가 작동됩니다.

#### 3. Sparkplug(비최적화 컴파일러)로 기계어 생성

- 비최적화된 컴파일러로 바이트코드를 빠르게 네이티브 코드(기계어)로 변환

#### 3. TurboFan(성능 최적화 컴파일러)로 기계어 생성

- JIT 컴파일러 사용해서 바이트코드를 네이티브 코드(기계어)로 변환

#### 4. 실행

- 생성한 네이티브 코드를 CPU에서 실행
  - 초기실행에서는 비최적화된 네이티브 코드가 실행되고
  - 이후 성능최적화 작업을 거쳐 최적화된 네이티브 코드를 실행합니다.

<br /><br />

---

## 1. JS를 AST로 파싱 : 코드 구조 이해하기

사람이 작성한 JS 코드를 컴퓨터가 이해할 수 있도록 계층적 구조로 만들어줘야 합니다.

```js
let x = '문자열' // 지금은 문자열 String
x = 1 // 이제는 숫자 Number
```

그리고 JS는 동적 언어이기 때문에 실행중에 타입이 바뀌기도 합니다. 실행 전에 타입을 고정하기가 어렵습니다. 이러한 JS의 복잡한 동작을 처리하기 위해서는 먼저 코드 구조를 파악해야합니다. 그래서 코드를 실행하기 전에 컴퓨터가 이해하기 쉬운 AST로 구조화해두게 됩니다. 이렇게 해두면 이후 컴파일이나 최적화 작업을 효율적으로 처리할 수 있습니다. 타입 정보는 이후 코드를 실행할 때 동적으로 학습하게 됩니다.
<br/>

1. parser
   즉시 실행에 필요한 코드를 전체 파싱합니다. 하지만 처리시간이 상대적으로 깁니다.

   - AST, 스코프 생성
   - 문법 오류 검출
   - 소스코드 [(v8/src/parsing/parser.cc)](https://github.com/v8/v8/blob/main/src/parsing/parser.cc)

2. [pre-parser](https://v8.dev/blog/preparser)
   즉시 실행에 필요한 코드가 아니고 나중에 실행될 코드일 때 사용하는 파서입니다.

   - AST 미생성, 스코프 생성
   - 일부 문법 오류만 검출
   - 소스코드 [(v8/src/parsing/preparser.cc)](https://github.com/v8/v8/blob/main/src/parsing/preparser.cc)

<br/>
파서는 위에 parser와 pre-parser(lazy-parser) 2개로 구분되어 사용됩니다.
실행되지 않는 함수나 코드를 전부 일반 파서로 처리하면 초기 로딩시간이 길어지기 때문에 pre-parser(lazy-parser)로 초기 로딩 시간을 단축시키는 것이 목적입니다.

- 예시 코드

  ```js
  const name = '유재석'
  console.log(name) // parser

  function greeting() {
    console.log('Hello!') // pre-parser
  }

  greeting() // 나중에 호출될 때 parser
  ```

<br/><br/>
그리고 밑처럼 AST로 파싱한 결과물을 보고 싶다면 [AST Explorer](https://astexplorer.net/) 사이트에서 테스트해볼 수 있습니다.

- JS 코드

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
            "name": "name" // 식별자명
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

<br /><br />

---

## 2. Ignition interpreter로 Byte code로 변환하기

- [이미지 출처 - v8](https://v8.dev/blog/background-compilation)
  ![](https://velog.velcdn.com/images/xmun74/post/55e235c0-1763-480e-b152-4ce4c86ac7d0/image.png)

: 코드 한줄 실행할때마다 AST를 받아서 바이트코드로 반환해주는 인터프리터
<br/>

- **메모리 사용량을 감소**하기 위해 컴파일러가 아닌 인터프리터를 사용
  : 컴파일러는 실행되지 않을 코드까지 네이티브 코드(기계어)로 변환해서 메모리 낭비가 발생하지만,
  인터프리터는 바이트코드로 변환하기 때문에 상대적으로 용량도 작고, 한 줄씩 실행될때마다 변환하여 메모리 사용에 효율적입니다.
  <br />

- 이전 방식이었던 Full-codegen 대체하는 인터프리터
  Full-codegen 컴파일의 단점으로 인해 인터프리터 단계가 추가되었다고 보시면 됩니다. 초기에 코드 실행 시 복잡한 네이티브 코드 생성이나 최적화를 건너뛰고, 빠르게 바이트코드를 사용해서 실행시키는 것에 초점에 맞춰져 있습니다.
  <br />

  > 마지막으로 바이트코드를 생성하는 것이 Full-codegen의 기준 컴파일된 코드를 생성하는 것보다 빠르기 때문에 Ignition을 활성화하면 일반적으로 스크립트 시작 시간이 개선되고 결과적으로 웹 페이지 로드도 개선됩니다.
  >
  > [- v8 Launching Ignition and TurboFan 본문 중 -](https://v8.dev/blog/launching-ignition-and-turbofan)

<br />
- 터미널에서 바이트코드 출력해보기
  코드를 바이트코드로 보고 싶으면 `node --print-bytecode index.js`를 실행해보면 확인할 수 있습니다. 참고사항으로는 만약 함수면 함수를 실행해야 결과물을 확인할 수 있습니다.

<br /><br />

---

## 3. Sparkplug 비최적화 컴파일러 도입

: 터보팬과 달리 최적화를 수행하지 않고 바이트코드를 -> 기계어 코드로 빠르게 생성하는 컴파일러

- 이그니션 - 터보팬의 중간단계인 **비최적화 컴파일러**
- 바이트코드 기반으로 네이티브코드(기계어) 생성하므로 속도가 빠름
- 터보팬에 비해서 최적화 작업을 생략하기 때문에 메모리 사용량 적음(최적화는 터보팬에 맡김)
  최적화하는 데에는 비용이 발생합니다. 그런데 이전에 너무 섣부린 최적화로 인한 비용이 발생했었기 때문에 이러한 문제를 덜고자 심플한 비최적화 컴파일러를 도입하게 됩니다.

## 4. 필요시 Turbofan compiler로 성능 최적화

: 최적화 작업을 수행해서 바이트코드를 머신코드로 변환하는 컴파일러

- 바이트코드를 분석해서 JIT 컴파일러로 성능 최적화 작업을 수행합니다.
- 터미널에서 최적화 코드 로그 출력해보기
  `node --trace-opt index.js`

<br/><br/><br/><br/>

> ### 자동차 엔진의 구조를 메타포로 사용한 용어 설명

처음에 작업흐름을 쭉 살펴보면 용어들이 굉장히 생소하게 느껴질 수 있습니다. 하지만 이 용어들이 어디서 차용되었는지를 이해하면 나중에 해당 내용들을 다시봐도 직관적으로 이해할 수 있기 때문에 마지막으로 간단하게 살펴보겠습니다.

#### V8

: 경주용 자동차나 비행기에서 사용되는 엔진으로, v자 형태의 8기통 고성능 엔진인 [v8](https://en.wikipedia.org/wiki/V8_engine)의 이름을 따서 만들었습니다. (이게 진짜 엔진이름인 줄은 몰랐습니다..)

<img
  src="/images/posts/v8-engine-01/241123-223547.png"
  width="200"
  height="200"
/>

#### Ignition(점화)

: 엔진을 가동시키는 점화 작업으로, JS코드를 빠르게 실행가능한 단계인 바이트코드로 변환하는 작업을 떠올리면 됩니다.

#### TurboFan

: 자동차 엔진의 터보차저로 고성능 가속 작업에 해당합니다. 이는 성능 최적화 작업을 수행하는 JIT 컴파일러를 떠올리면 됩니다.

<br /><br /><br /><br />

---

<br /><br /><br /><br />

여기까지 V8 엔진의 작업 흐름에 대해서 살펴보았습니다. 이번 편에서는 Spartplug나 TurboFan에 대해서 깊게 보지 않았는데... 관련 내용들이 살펴볼게 좀 있고, 뭔가 글이 너무 길어질 것 같아서 다음 블로그 글로 써보려고 합니다!

<br /><br /><br /><br />

---

# 참고

- [V8 github](https://github.com/v8/v8)
- https://evan-moon.github.io/2019/06/28/v8-analysis/
- [Youtube - BlinkOn 6 Day 1 Talk 2: Ignition - an interpreter for V8](https://www.youtube.com/watch?v=r5OWCtuKiAk)

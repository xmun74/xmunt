---
title: 'JavaScript 실행하기 전 과정: 컴파일 과정에 대해서'
description: 'V8엔진의 Sparkplug, Maglev, TurboFan 컴파일러를 살펴보고 히든 클래스에 대해서 살펴보겠습니다.'
coverImage: '/images/posts/v8-engine-02/241222-202514.png'
image: ''
date: '2024-12-22'
path: 'v8-engine-02'
category: 'JavaScript'
tags:
  - V8
  - JavaScript
---

# 목차

- 컴파일러 차이 AOT vs JIT
- Sparkplug
- Maglev
- TurboFan
- 히든 클래스

<br /><br />

---

<br /><br />

컴파일 전략을 컴파일 시점에 따라 구분되는 AOT(Ahead-of-Time)과 JIT(Just-In-Time)으로 나눠서 설명해보겠습니다.
여기서 `Time`은 코드실행시간으로 `런타임`을 말합니다.

## 1. AOT(Ahead-of-Time) 컴파일러

: 런타임 이전(코드 실행 전)에 미리 정적으로 컴파일(소스코드를 기계어로 변환)

- 정적언어에 적합 : (예시) C/C++, Swift, Rust
- 컴파일 시간 김 : 실행 전 모든 코드를 완전히 컴파일합니다.
- 초기 실행 속도가 빠름 : 실행 후 추가 작업이 없으므로 초기 실행 속도가 빠릅니다.

## 2. JIT(Just-In-Time) 컴파일러

: **런타임(코드 실행시점)일때 동적으로** 컴파일(소스코드를 기계어로 변환)
<br />

> 자바스크립트는 동적 타이핑 언어이기 때문에 실행 중에 최적화가 필요하므로 JIT 컴파일러를 사용합니다.

<br />
- 동적언어에 적합 : (예시) JavaScript, Ruby 등
- 컴파일 시간 짧음 : 실행 중 필요한 부분씩 컴파일합니다.
- 초기 실행 속도 비교적 느림 : 초기 실행에 컴파일 작업이 포함되기 때문에 비교적 느리지만, 최적화를 통해 점진적으로 성능이 향상됩니다.
- 런타임 정보(변수 등)에 접근 가능

<br /><br /><br /><br />

---

<br /><br />

![241222-202514](/images/posts/v8-engine-02/241222-202514.png)

## [Sparkplug](https://v8.dev/blog/sparkplug)

: 💥 빠른 초기 실행을 위해 최적화 작업이 제거된 JIT 컴파일러.

- 바이트코드를 최적화되지 않은 머신 코드로 컴파일
- `낮은 코드품질`로 `빠르게` 컴파일하여 초기 실행 속도 높임
- Ignition과 TurboFan 사이에서 갭이 너무 크기 때문에 기본 JIT를 도입
- 자주 실행되지 않는 코드나 최적화가 필요없는 코드에 적용

## [Maglev](https://v8.dev/blog/maglev)

: 🚅 반복 실행되는 코드에 간단한 최적화를 수행하는 JIT 컴파일러

- 2023년에 추가된 Sparkplug와 TurboFan 사이에서 트레이드오프를 줄이게 위해 도입한 SSA기반의 최적화 컴파일러.
- Sparkplug보다 개선된 코드 품질(성능)
- TurboFan보다는 빠른 속도
- Sparkplug보다 약 20배 느리게 코드를 생성하지만, TurboFan보다는 10~100배 빠르게 코드를 생성
- 코드가 자주 실행될 경우 Sparkplug에서 Maglev로 전환

## [TurboFan](https://v8.dev/docs/turbofan)

: 🚀 고성능 최적화 작업의 JIT 컴파일러.

- `높은 코드품질`의 `느린 속도`로 컴파일(~100배 속도차이)
- 많이 사용되는 코드 hot code를 최적화시킴
- 최적화 코드가 더이상 사용되지 않으면 역최적화(Deoptimization) 진행
- 히든클래스, 인라인 캐싱 등 최적화 기법 사용

## 실행 및 Profiling

: 코드를 실행하고 나서 많이 사용되는 코드인지 프로파일링하여 데이터를 수집하고, hot code면 TurboFan에 전달하여 최적화 진행할 수 있도록 도움을 줍니다.

- 런타임 중 코드의 성능 데이터를 모니터링하여 수집
- hot code를 분석 : 많이, 자주 사용되는 코드를 확인 (함수 호출 빈도, 루프 실행 획수, 객체 구조 변경 등)
- Deoptimization : 최적화 코드가 런타임 상황에 부적절해지면 역최적화 작업

<br /><br />

---

<br /><br /><br /><br />

# 동적으로 변하는 객체의 프로퍼티를 어떻게 빨리 탐색할까?

### 자바스크립트는 동적 타이핑 언어 (Dynamic Typing)

```js
const obj = {}
console.log(obj) // {}

obj.mc = '유재석'
console.log(obj) // {mc: '유재석'}

obj.age = 50
console.log(obj) // {mc: '유재석', age: 50}
```

JS는 동적 언어로 런타임에 객체의 프로퍼티의 데이터타입, 순서, 값, 수가 변경될 수 있습니다. 그래서 프로퍼티 값 읽을 때마다 찾아내는 동적 탐색이 필요합니다. 이 동적탐색은 속도 저하때문에 성능 이슈가 있습니다.
그래서 v8엔진은 동적탐색보다 빠른 객체의 프로퍼티 접근 처리를 위해 내부적으로 히든클래스를 사용하여 최적화합니다.

## 히든 클래스 Hidden Class

히든 클래스는 TurboFan의 최적화 방법으로 객체의 구조와 속성을 추적하여 빠른 접근이 가능하도록 최적화하는 작업입니다.
<br/>

> ` Hidden Class = Maps = Structure = Shapes`
> : Hidden Class 명칭에서 JS에서의 Class와 혼동을 막기 위해 다르게 부르기도 합니다. 그리고 엔진 별로 지칭하는 용어를 다르게 부릅니다.
>
> - V8 - Maps
> - JavaScriptCore(Safari) - Structure
> - SpiderMonkey (Firefox) - Shapes

<br/>

#### 특징

1. 각 프로퍼티에 대해서 offset을 가짐
   > offset이란? 객체의 프로퍼티가 메모리에서의 상대 위치를 나타내는 주소
2. 새로운 프로퍼티 추가/제거 시 새로운 히든 클래스로 생성

![241222-221147](/images/posts/v8-engine-02/241222-221147.png)
객체의 프로퍼티명 `x`, `y`는 히든클래스에 저장됩니다. 그리고 해당 프로퍼티의 offset(몇번째 인덱스에 위치하는지)가 생성됩니다.

### 장점: 동일한 프로퍼티를 가진 다른 객체일 때 재사용

![241222-221210](/images/posts/v8-engine-02/241222-221210.png)
위 예시는 `obj`와 `obj2` 두 객체의 프로퍼티 구조와 순서가 모두 동일합니다. 그렇기 때문에 동일한 히든 클래스를 공유하여 재사용한다는 장점이 있습니다.
이는 동일한 구조의 객체를 반복해서 만들어도 객체 프로퍼티 접근 시 동적탐색을 피해서 이미 생성된 히든클래스를 재사용합니다.

### 지양: 객체 프로퍼티를 동적 생성할 때

![241222-222924](/images/posts/v8-engine-02/241222-222924.png)

```js
const obj = {}
obj.x = 2 // 히든 클래스 H1 생성
obj.y = 3 // 히든 클래스 H2로 전환
```

맨 처음 빈 객체`{}`로 시작해서 이후 동적으로 프로퍼티가 추가되고 있는 코드일때는
한 줄 씩 실행될때마다 새로운 히든 클래스를 생성하게 됩니다. 이렇게 되면 기존 히든클래스에서 다른 히든클래스로 생성되면서 성능에 영향을 미칩니다. 따라서 속성을 동적으로 추가하는 방식을 지양하는게 좋습니다.
<br/>

> 객체 초기 생성 시 모든 프로퍼티를 초기화로 생성하거나 동일한 순서와 구조로 생성하자.

<br/><br/><br/>

### 개발자도구에서 확인하기

1. 콘솔에 코드 입력

   ```js
   function Broadcast(title) {
     this.title = title
   }
   const one = new Broadcast('무모한 도전')
   const two = new Broadcast('무한도전')
   ```

2. Memory 탭 - Heap snapshot - Take snapshot 클릭해서 스냅샷 찍기
   ![](https://velog.velcdn.com/images/xmun74/post/317d88b0-b5b7-4221-9503-b661abe70ea3/image.png)

3. 'Broadcast'로 필터 검색하기
   - 참조하는 히든클래스 ID가 동일함
     ![](https://velog.velcdn.com/images/xmun74/post/cf810dd2-1a9e-4be0-a1c6-99e64d7f3250/image.png)

#### 객체 프로퍼티를 동적 생성한 경우도 확인해보기

생성자 함수로 생성된 one 객체에 프로퍼티를 추가해보겠습니다.
one객체는 새로운 프로퍼티가 생성됐기 때문에 신규 히든클래스(map)이 생성됩니다.

```js
function Broadcast(title) {
  this.title = title
}
var one = new Broadcast('무모한 도전')
var two = new Broadcast('무한도전')
// 여기까지 one, two는 같은 히든 클래스 참조
one.short = '무도' // 추가됨
// 여기부터 one, two는 서로 다른 히든 클래스 참조
```

스냅샷을 다시 찍어보면 Map ID가 달라진 것을 확인할 수 있습니다. one, two 객체가 서로 다른 히든 클래스를 참조하고 있습니다.
![](https://velog.velcdn.com/images/xmun74/post/28778d1b-6529-4e88-aba0-d9c3e2e91f96/image.png)

<br /><br /><br />

---

<br /><br />

# 참고

- [Maps (Hidden Classes) in V8 - v8](https://v8.dev/docs/hidden-classes)

- [V8의 히든 클래스 이야기 - LINE](https://engineering.linecorp.com/ko/blog/v8-hidden-class)

- [V8의 자바스크립트를 위한 성능 팁 - web.dev](https://web.dev/articles/speed-v8?hl=ko&source=post_page-----2e136ec1cfeb--------------------------------)

- https://mathiasbynens.be/notes/shapes-ics

- [JIT 취약점 되살리기: Chrome 브라우저에서 Maglev 컴파일러 버그의 힘 활용 - Tencent Security Xuanwu Lab PPT](https://medium.com/@vxrl/javascript-debugging-with-maglev-compiler-6b2a26cb1a3a)

- https://i.blackhat.com/EU-23/Presentations/EU-23-Liu-Reviving-JIT-Vulnerabilities.pdf

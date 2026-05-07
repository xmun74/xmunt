---
title: "React useState 완전 가이드"
date: "2026-05-07"
description: "useState 훅의 동작 원리와 올바른 사용 패턴을 코드 예시와 함께 정리합니다."
tags: ["react", "hooks"]
---

## 개요

`useState`는 React 함수형 컴포넌트에서 상태를 관리하는 가장 기본적인 훅입니다. 초기값을 받아 **현재 상태**와 **상태 변경 함수**를 튜플로 반환합니다.

## 기본 사용법

`useState`의 타입 시그니처는 다음과 같습니다.

```ts
const [state, setState] = useState<T>(initialValue: T)
```

아래 예시에서 버튼을 클릭하면 카운트가 1씩 증가합니다.

```tsx:panel Counter.tsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

## 함수형 업데이트

상태 업데이트가 이전 상태에 의존하는 경우, 함수형 업데이트를 사용해야 합니다. 그렇지 않으면 stale closure 문제가 발생할 수 있습니다.

```tsx:panel FunctionalUpdate.tsx
import { useState } from 'react'

export default function FunctionalUpdate() {
  const [count, setCount] = useState(0)

  const addTwo = () => {
    // 함수형 업데이트로 최신 상태 보장
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={addTwo}>+2</button>
    </div>
  )
}
```

## 주의사항

- 상태를 직접 변경하지 말고 항상 setter 함수를 통해 변경하세요.
- 객체나 배열 상태는 불변성을 유지하며 업데이트해야 합니다.
- 초기값으로 함수를 전달하면 컴포넌트 마운트 시 한 번만 실행됩니다 (lazy initialization).

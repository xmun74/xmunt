---
title: 'tsserver란?'
description: 'TypeScript Standalone Server(aka TS Server)에 대해서 간단하게 살펴보도록 하겠습니다! '
coverImage: '/images/posts/tsserver/250202-230741.png'
image: ''
date: '2025-02-02'
path: 'tsserver'
category: 'TypeScript'
tags:
  - TypeScript
---

<br /><br /><br /><br />

![250202-230741](/images/posts/tsserver/250202-230741.png)
ts server가 뭔지 모르시겠다구요?! 하지만 타입스크립트를 써봤다면 다를 해봤을 `Restart TS Server`...
그동안 멋모르고 지나갔던 TS Server에 대해서 알아보도록 하겠습니다!

<br /><br /><br /><br />

# tsserver란?

TypeScript Standalone Server (aka TS Server)는 언어 서비스를 제공하는 독립적인 서버입니다. 여기서 언어 서비스란 IDE 같은 개발 환경에서 코드 자동완성(IntelliSense), 정의로 이동(Go to Definition), 타입 검사 등의 서비스를 말합니다. TypeScript와 같이 언어와 관련된 기능을 제공하기 때문에 언어 서비스라고 부릅니다. TS 서버는 JSON 프로토콜을 통해 IDE 또는 에디터와 통신하며, 실시간으로 코드를 분석해 오류나 경고를 반환하고, 필요한 정보를 에디터에 제공합니다.
우리가 TypeScript를 설치하고 나면 vscode 상에서 타입검사 등을 할 수 있게 도와주는 것이 바로 tsserver라고 생각하시면 됩니다.

실행파일은 typescript를 설치한 다음 밑 폴더경로를 통해서 찾을 수 있습니다.

```bash
npm install --save typescript // 설치 후
ls node_modules\typescript\lib\tsserver.js
// .yarn\sdks\typescript\lib\tsserver.js // or yarn으로 설치 시
```

<br />

### 1. 특징

- JSON 프로토콜 사용
- Node.js 환경에서 실행되는 백그라운드 프로세스
- 편집기와 IDE(VS Code, WebStorm 등) 지원

<br />

### 2. 동작 과정

1. vscode에서 `.ts` 혹은 `.tsx` 파일 열면 백그라운드에서 자동으로 tsserver가 실행됩니다.
2. IDE(클라이언트)가 해당 파일 초기화하도록 tsserver에 파일경로, ts버전, 옵션 등을 포함해서 요청합니다.
3. 그러면 tsconfig.json 보고 tsserver가 프로젝트를 설정합니다.
4. 이후 IDE에서 코드입력 혹은 저장 시 코드완성, 타입검사 등 서비스 사용하기 위해 tsserver에 요청합니다.
5. tsserver는 코드를 분석한 후 응답을 반환합니다.

<br />

### 3. ts server 로그 확인하기 (vs code)

1. `Ctrl + Shift + P` → "TypeScript: Open TS Server logs" 클릭
   클릭하면 파일로 이동하며 해당 파일에서 실시간 로그를 확인할 수 있습니다.
   가장 상단을 보면 TS Server 시작되는 것을 확인할 수 있습니다. - [참고](https://github.com/microsoft/TypeScript/wiki/Getting-logs-from-TS-Server-in-VS-Code)

```bash
Info 0    [19:12:58.515] Starting TS Server
Info 1    [19:12:58.515] Version: 5.1.3
Info 2    [19:12:58.515] Arguments: /Users/~~~ //  파일경로 및 vscode 위치 표시
```

그리고 가장 하단을 보면 실제로 언어 서비스 기능을 사용한 내용에 대해서 request, response 로그를 실시간으로 기록하고 있는 것을 살펴볼 수 있었습니다.
![](https://velog.velcdn.com/images/xmun74/post/12e70ac9-6a18-4920-b978-f8ec645535bb/image.png)

<br /><br /><br /><br />

## LSP란?

먼저 우리가 쓰는 IDE는 특정언어가 아닙니다. 그런데 어떻게 자동완성, 구문강조 표시, 에러표시 등 프로그래밍 언어에 밀접한 서비스를 사용할 수 있었을까요? 바로 이 LSP(Language Server Protocol). 언어 서버 프로토콜을 통해서 언어과 밀접한 지원을 편집기나 IDE와 독립적으로 구현하고 배포할 수 있도록 해주게 됩니다. 개발자들이 IDE를 쓰면서 실시간으로 에러나 경고를 확인할 수 있게 도와줍니다.

LSP(Language Server Protocol)는 소스코드편집기나 IDE와 언어 인텔리전스 도구를 제공하는 서버간에 사용되는 개방형 [JSON-RPC(JSON Remote Procedure Call)](https://en.wikipedia.org/wiki/JSON-RPC) 기반 프로토콜입니다. 여러 언어 서버를 표준화하기 위해서 개발됐고, 원래는 Microsoft용으로 개발되었지만 현재는 표준이 됐습니다. - [참고](https://en.wikipedia.org/wiki/Language_Server_Protocol)

<br /><br /><br /><br />

## JSON 프로토콜

tsserver는 편집기 및 IDE(VS Code 등)와의 통신을 위해서 [JSON-RPC (JavaScript Object Notation-Remote Procedure Call)](https://en.wikipedia.org/wiki/JSON-RPC) 기반의 프로토콜을 사용하고 있습니다.
먼저 JSON 프로토콜 예시 내용을 살펴보기 위해 ts server 로그파일을 들어가보면 아래와 같은 JSON 객체 결과를 확인할 수 있습니다.

1. 요청

- quickinfo : 코드위에서 마우스 호버 시 해당코드의 타입 정보를 가져오는 요청

```bash
Info 1267 [19:46:46.993] request:
    {
      "seq": 210,             // 요청 시퀀스 번호
      "type": "request",
      "command": "quickinfo", // 요청 명령어
      "arguments": {
        "file": "/Users/username/Documents/파일경로.tsx",
        "line": 12,
        "offset": 28
      }
    }
```

2. 응답

```bash
Perf 1268 [19:46:46.994] 210::quickinfo: elapsed time (in milliseconds) 1.7008
Info 1269 [19:46:46.995] response:
// 위는 성능로그. 요청 처리하는 데 걸린 시간 1.7ms

{
  "seq": 0,                // 응답 시퀀스번호
  "type": "response",
  "command": "quickinfo",
  "request_seq": 210,       // 요청 시퀀스 번호
  "success": true,          // 요청 성공여부
  "body": {
    "kind": "parameter",    // 대상이 함수의 매개변수임
    "kindModifiers": "",
    "start": { "line": 12, "offset": 24 },
    "end": { "line": 12, "offset": 29 },
    "displayString": "(parameter) label: any",   // 변수 label의 타입정보
    "documentation": [],
    "tags": []
  }
}
```

<br /><br /><br /><br />

## 사용가능한 곳

- Visual Studio Code
- Tide
- Neovim 등....
  - ![](https://velog.velcdn.com/images/xmun74/post/5b515aa6-c537-4935-ac7a-a018483841d5/image.png)
  - 하지만 Nvim-Typescript의 깃헙을 들어가보면 DEPRECATED 되어 있다. 이유는 Neovim 0.5가 출시되면서 LSP가 공식적으로 지원되기 때문에 마이그레이션을 하라는 내용이 기술되어 있습니다....

<br /><br /><br /><br />

# 참고

- [Standalone Server (tsserver) - microsoft/TypeScript github](<https://github.com/microsoft/TypeScript/wiki/Standalone-Server-(tsserver)>)

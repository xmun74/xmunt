---
title: '개행.줄바꿈.EOL(end-of-line)문자란? - CR, LF'
description: 'CR, LF에 대해서 알아보자'
coverImage: ''
image: ''
date: '2024-10-13'
path: 'crlf'
category: ''
tags:
  - CRLF
---

# 어쩌다 LF를 검색…?

다짜고짜 LF와 CR에 대해서 알고싶어서(?!) 이를 검색해본 건 아니고
아래와 같은 에러를 만나서 이에 대해 알아보게되었다.
윈도우 환경에서(중요) eslint, prettier를 설정하던 중 코드의 마침부분마다 에러가 표시되고 있었다.

### 에러

```
Delete `␍`
```

![241013-173454](/images/posts/crlf/241013-173454.png)

<br />

### 원인

- 회사는 윈도우고 개인 노트북은 맥인데,
  맥에서 작성했던 prettierrc를 그대로 복붙했더니 문제가 발생했던 것이다.

### 해결 방법

- "endOfLine": "lf"에서 "auto"로 변경
  `"endOfLine": "auto",`

```js
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "bracketSameLine": false,
  "bracketSpacing": true,
  //  "endOfLine": "lf", // 삭제
  "endOfLine": "auto", // 추가
   "printWidth": 120,
  "proseWrap": "preserve"
}

```

- Prettier v2.0.0부터 endOfLine의 기본값이 auto에서 lf로 변경됨
  - [Options · Prettier](https://prettier.io/docs/en/options.html#end-of-line)

---

<br /><br />

# 줄바꿈의 시작

![](https://velog.velcdn.com/images/xmun74/post/267298e1-ed2e-46c7-9f27-4ca5a9ac02d7/image.gif)

- [참고 영상](https://www.youtube.com/watch?v=FkUXn5bOwzk)

![241013-173532](/images/posts/crlf/241013-173532.png)

LF와 CR이란 용어는 `타자기`에서 부터 의미가 시작된다.

타자를 입력할 때마다 종이가 오른쪽에서 왼쪽으로 움직이는데
한 줄을 다 입력해서 오른쪽 끝에 다다르면 다음줄 + 맨 처음으로 이동해야한다.
이때 2가지의 동작이 이뤄진다.

1. 왼쪽 레버를 오른쪽으로 당겨서 종이의 맨 왼쪽으로 이동하고
2. 다음줄로 넘어가기 위해 종이를 위로 올려서 세로 줄넘김을 한다.

- `Carriage`란 종이를 고정해주는 롤처럼 생긴 장치다.
- `Carriage Return`은 레버를 당겨서 종이를 맨 왼쪽으로 이동시키기는 것을 뜻한다.
- `Line Feed`는 한줄만큼 종이를 위로 올려서 세로 줄넘김하는 것을 말한다.

<br />

### 1. CR `\n`

Carriage Return : 커서를 맨앞으로 이동 (가로)

### 2. LF `\r`

Line Feed : 커서는 그대로인 상태에서 다음줄로 이동 (세로)

### CRLF `\r\n`

Carriage Return Line Feed : 커서 맨앞 이동 + 다음줄 이동

- CR과 LF의 조합

<br /><br />

## 운영체제 별 개행

코드 작성할 때 키보드 `엔터` 키를 누를때마다 개행문자라는 보이지 않는 문자가 삽입된다.
그런데 운영체제마다 기본으로 채택하고 있는 line ending 개행문자(줄바꿈) 처리방식이 다르다.

#### 1. Windows OS

- 두가지를 조합한 CRLF `\r\n` 채택
- 윈도우에서 LF 개행으로 된 파일을 읽을 때 깨짐 현상 발생
  1. 줄바꿈 충돌로 글자가 붙여서 보여짐
  2. 글자 제일 마지막에 특수문자 `^M` 이 출력됨

#### 2. UNIX 및 MAC OS(9 버전 이후)

- LF `\n` 채택
- MAC OS 9 이전 버전 (매킨토시:Machintosh) - CR 채택
  원래 초창기 9버전 이전에는 CR를 사용했지만,
  그 이후부터는 Unix와 일치하는 LF로 변경됐다.

![241013-173706](/images/posts/crlf/241013-173706.png)

> - 이스케이프 시퀀스란?
>   프린트할 수 없지만 개념상 있는 문자 (예: 개행`\n`, 탭`\t`)

<br/>
- 자바스크립트에서 keyCode가 13이면 엔터를 의미하는데 이 아스키코드에서 나온 것이다.

<br /><br />

# 그러면 왜 지금은 개행방식이 나눠졌나?

1963~1968년까지 ISO(국제표준화기구)에서는 개행문자로 CR+LF를 채택했다. 밑 사진의 텔레타이프라는 전신타자기에서 주로 사용됐다.

그러다가 1964년 등장한 멀틱스 운영체제에서부터 개행문자를 LF만으로 채택하기 시작했다. 이는 컴퓨터가 막 등장하던 시기여서 메모리 비용이 비쌌기 때문에 바이트가 작은 LF만은 채택한 것이다.
Unix와 리눅스도 멀틱스의 관례를 이어나가게 됐다.
윈도우는 1981년 등장한 DOS 운영체제의 CR+LF 방식의 관례를 따르게 된 것이다.

- [텔레타이프 (전신타자기)](https://ko.wikipedia.org/wiki/%EC%A0%84%EC%8B%A0%ED%83%80%EC%9E%90%EA%B8%B0)
  ![241013-173750](/images/posts/crlf/241013-173750.png)

<br /><br /><br /><br />

# Git에서의 줄 끝

Git으로 개발자들과 협업하는데 윈도우와 맥을 혼용해서 코드를 올리고 있었다면,
컴퓨터에서는 CRLF와 LF의 각 바이트 값이 다르기 떄문에 다르게 인식한다.
그래서 형상관리 툴에서는 개행방식이 다르면 diff로 인식되어 서로 다른 코드라고 보게 된다.
따라서 git commit할 때 실제 변경하지 않은 파일도 개행방식이 다른 것 때문에 변경된 것으로(CRLF에서 LF로 변환 또는 반대) 잘못 인식하게 된다.

- 윈도우에서 `git add .` 시 밑과 같은 warning을 만나게 된다.

```
warning: LF will be replaced by CRLF in 파일경로
The file will have its original line endings in your working directory
```

이는 커밋 내역, 코드 이력관리에 좋지 않으므로 설정이 필요하다.

> 협업 시 개발자 간 사용중인 OS가 다를 경우 Git에서 예기치 않은 문제가 생길 수 있다.

### [해결방법](https://docs.github.com/ko/get-started/getting-started-with-git/configuring-git-to-handle-line-endings?platform=mac)

- Windows OS

```bash
git config --global core.autocrlf true
```

1. Git에서 가져올 때 - Git LF -> Windows CRLF로 변경
2. Git에 전송할 때 - Window CRLF -> Git LF로 변경

- Mac OS

```bash
git config --global core.autocrlf input
```

- [Prettier 참고](https://prettier.io/docs/en/options.html#end-of-line)

<br /><br /><br /><br />

#### VSCode 개행 확인

- 윈도우 VSCode는 개행이 CRLF로 기본설정 되어 있다.
  ![241013-173810](/images/posts/crlf/241013-173810.png)

- 맥 VSCode는 개행이 LF로 기본설정 되어 있다.
  ![241013-173817](/images/posts/crlf/241013-173817.png)

<br /><br /><br /><br />

# 참고

- [Carriage return - wiki](https://en.wikipedia.org/wiki/Carriage_return#Computers)

- [Why is the line terminator CR+LF? - Microsoft, Raymond Chen](https://devblogs.microsoft.com/oldnewthing/20040318-00/?p=40193)

- https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/

- [개발 용어 : 캐리지 리턴(CR), 라인 피드 (LF) 알아보기](https://jw910911.tistory.com/90)

- [LF와 CRLF의 차이 (Feat. Prettier)](https://velog.io/@jakeseo_me/LF와-CRLF의-차이-Feat.-Prettier)

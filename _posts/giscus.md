---
title: 'Next.js 블로그에 댓글기능 추가하기 - Giscus'
description: 'Giscus를 통해 댓글기능 추가'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2023-03-07'
path: 'giscus'
category: ''
tags:
  - '댓글기능'
  - 'Giscus'
---

# 댓글 기능을 추가하자

#### 댓글기능을 구현한 오픈소스들

오픈소스를 사용해서 손쉽게 댓글기능을 추가할 수 있다.
그 중 [giscus](https://giscus.app/ko)는 Github API를 사용하여 Discussions으로 불러오기 때문에 대댓글을 작성할 수 있고 시간순/인기순 정렬, 리액션 추가, 지연 로딩 등을 지원해줘서 해당 오픈소스를 선택했다.

1. [giscus](https://giscus.app/ko) - Github Discussions 기능을 사용
2. [utterances](https://utteranc.es/) - Github Issue 기능을 사용
3. [disqus](https://disqus.com/)

<br></br>

# Setting

1. Github 블로그 프로젝트 레포가 `Public`이어야 함
2. [Discussions 기능 활성화](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)

- 레포 Settings - Features탭에 Discussions 체크
  ![](https://velog.velcdn.com/images/xmun74/post/a9d1c359-10f6-4adb-b278-ef75eb261b45/image.png)

3. 해당 레포에 [giscus 앱 설치](https://github.com/apps/giscus)
4. [한글 공식문서](https://giscus.app/ko)따라 설정하기
   설정 부분 보면서 원하는대로 config를 정하면 자동으로 `script` 태그를 생성해주는데 이 `script` 태그를 코드에 넣으면 된다.
   ```html
   <script
     src="https://giscus.app/client.js"
     data-repo="[복붙]"
     data-repo-id="[복붙]"
     data-category="General"
     data-category-id="[복붙]"
     data-mapping="pathname"
     data-strict="0"
     data-reactions-enabled="1"
     data-emit-metadata="0"
     data-input-position="bottom"
     data-theme="preferred_color_scheme"
     data-lang="ko"
     data-loading="lazy"
     crossorigin="anonymous"
     async
   ></script>
   ```

# 블로그에 적용한 코드

- Next.js를 기반으로 `script`태그에 config 속성 적용한 코드

  ```tsx
  import { useRouter } from 'next/router'
  import { useEffect, useRef, useState } from 'react'
  import { useRecoilValue } from 'recoil'
  import { getLocalStorage } from '../lib/localStorage'
  import themeState from '../states/atoms/theme'

  export default function Giscus() {
    const refEl = useRef<HTMLDivElement>(null)
    const router = useRouter()

    function getInitTheme() {
      if (typeof window !== 'undefined') {
        const localTheme = getLocalStorage('theme')
        if (localTheme) {
          return localTheme
        }
        return 'light'
      }
      return 'light'
    }
    const theme = useRecoilValue(themeState) === 'dark' ? 'dark' : 'light' // 테마 토글버튼 클릭 시 변경하기

    useEffect(() => {
      const curTheme = getInitTheme() === 'dark' ? 'dark' : 'light' // 새로고침 시 저장된 테마 불러오기
      if (!refEl.current || refEl.current.hasChildNodes()) return

      const scriptEl = document.createElement('script')
      scriptEl.src = 'https://giscus.app/client.js'
      scriptEl.async = true
      scriptEl.crossOrigin = 'anonymous'
      scriptEl.setAttribute('data-repo', 'xmun74/xmunt')
      scriptEl.setAttribute('data-repo-id', 'R_kgDOIwVyxg')
      scriptEl.setAttribute('data-category', 'General')
      scriptEl.setAttribute('data-category-id', 'DIC_kwDOIwVyxs4CUrIr')
      scriptEl.setAttribute('data-mapping', 'pathname')
      scriptEl.setAttribute('data-strict', '0')
      scriptEl.setAttribute('data-reactions-enabled', '1')
      scriptEl.setAttribute('data-emit-metadata', '0')
      scriptEl.setAttribute('data-input-position', 'bottom')
      scriptEl.setAttribute('data-theme', curTheme)
      scriptEl.setAttribute('data-lang', 'en')
      scriptEl.setAttribute('data-loading', 'lazy')

      refEl.current.appendChild(scriptEl)
    }, [])

    useEffect(() => {
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame',
      )
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app',
      )
    }, [theme])

    return <section ref={refEl} />
  }
  ```

- theme에 맞게 댓글테마도 변경해야해서 테마와 관련된 코드를 추가했다.
  https://github.com/giscus/giscus/issues/336 를 참고하여 코드를 작성했다.

#### 참고

https://github.com/giscus/giscus/issues/336

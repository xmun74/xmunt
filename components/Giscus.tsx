import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { getLocalStorage } from '../lib/webStorage'
import themeState from '../states/atoms/theme'

export default function Giscus() {
  const refEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

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
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame',
    )
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app',
    )
  }, [theme, mounted])

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame',
    )
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { term: router.asPath } } },
      'https://giscus.app',
    )
  }, [router.asPath])

  return <section ref={refEl} />
}

'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '@lib/theme-context'
import { getLocalStorage } from '../lib/webStorage'

export default function Giscus() {
  const refEl = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
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
  const { theme } = useThemeContext()

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
      'iframe.giscus-frame'
    )
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    )
  }, [theme, mounted])

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame'
    )
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { term: pathname } } },
      'https://giscus.app'
    )
  }, [pathname])

  return <section ref={refEl} />
}

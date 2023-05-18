import { useRouter } from 'next/router'
import { SetStateAction, useEffect } from 'react'
import {
  getSessionStorage,
  removeWebStorage,
  setSessionStorage,
} from '../webStorage'

interface ScrReProps {
  page: number
  setPage?: React.Dispatch<SetStateAction<number>>
}

export default function useScrollRestoration({ page, setPage }: ScrReProps) {
  const router = useRouter()

  useEffect(() => {
    // setTimeout(() => window.scrollTo(0, 1303), 1000)
    console.log(page, document.body.scrollHeight)
    let scrollStore: null | { x: number; y: number }

    const onRouteChangeStart = () => {
      setSessionStorage('scroll-position', {
        x: window.pageXOffset,
        y: window.pageYOffset,
      })
      setSessionStorage('page', page)
      console.log('1. 경로변경 전 저장', window.pageXOffset, window.pageYOffset)
    }

    const onRouteChangeComplete = () => {
      if (scrollStore) {
        const { x, y } = scrollStore
        console.log('3. 경로변경 후 (복구)', scrollStore)
        setTimeout(() => window.scrollTo(x, y), 100)
        scrollStore = null
        removeWebStorage('scroll-position', 'session')
        removeWebStorage('page', 'session')
      }
    }

    // 경로 작동 전 수행할 것. return ture면 popstate 호출함. popstate는 뒤로가기/앞으로가기 버튼 클릭 시 호출
    router.beforePopState(() => {
      scrollStore = getSessionStorage('scroll-position')
      console.log('2. 뒤로가기 전 실행', scrollStore)
      return true
    })
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
}

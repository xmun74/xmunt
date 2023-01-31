import Image from 'next/image'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import useToggleTheme from '../../lib/hooks/useToggleTheme'
import { getLocalStorage } from '../../lib/localStorage'
import Moon from '../../public/static/Moon.svg'
import Sun from '../../public/static/Sun.svg'
import themeState from '../../states/atoms/theme'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function ThemeToggleBtn() {
  const [themeMode, setThemeMode] = useRecoilState(themeState)
  const [theme, toggleThemeMode] = useToggleTheme()

  // 초기 로컬스토리지 테마 조회
  useEffect(() => {
    const localStorageTheme = getLocalStorage('theme')
    if (!localStorageTheme) return
    if (localStorageTheme === 'light') {
      setThemeMode('light')
    } else {
      setThemeMode('dark')
    }
    document.body.dataset.theme = theme
  }, [])

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  return (
    <div>
      {theme === 'light' ? (
        <ToggleBtn onClick={toggleThemeMode}>
          <Image width={42} height={42} src={Sun} alt="해 로고" />
        </ToggleBtn>
      ) : (
        <ToggleBtn onClick={toggleThemeMode}>
          <Image width={34} height={34} src={Moon} alt="달 로고" />
        </ToggleBtn>
      )}
    </div>
  )
}

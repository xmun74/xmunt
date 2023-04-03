import Image from 'next/image'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import useToggleTheme from '../../lib/hooks/useToggleTheme'
import { getLocalStorage } from '../../lib/webStorage'
import Moon from '../../public/static/Moon.svg'
import Sun from '../../public/static/Sun.svg'
import themeState from '../../states/atoms/theme'
import { themeColor } from '../../styles/theme'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${themeColor.accent3};
    transition: 0.2s ease-in-out;
  }
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
      <ToggleBtn onClick={toggleThemeMode}>
        {theme === 'light' ? (
          <Image width={30} height={30} src={Sun} alt="해 로고" />
        ) : (
          <Image width={28} height={28} src={Moon} alt="달 로고" />
        )}
      </ToggleBtn>
    </div>
  )
}

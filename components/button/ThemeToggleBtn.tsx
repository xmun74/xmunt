import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import SunIcon from '@components/icons/SunIcon'
import MoonIcon from '@components/icons/MoonIcon'
import useToggleTheme from '../../lib/hooks/useToggleTheme'
import { getLocalStorage } from '../../lib/webStorage'
import themeState from '../../states/atoms/theme'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
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
      <ToggleBtn onClick={toggleThemeMode}>
        {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      </ToggleBtn>
    </div>
  )
}

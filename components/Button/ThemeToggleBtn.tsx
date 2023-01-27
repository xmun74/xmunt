import Image from 'next/image'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { getLocalStorage, setLocalStorage } from '../../lib/localStorage'
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
  const [theme, setTheme] = useRecoilState(themeState)
  const handleThemeMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  useEffect(() => {
    document.body.dataset.theme = theme
    setLocalStorage('theme', `${theme}`)
    console.log('저장된것', getLocalStorage('theme'))
  }, [theme])
  return (
    <div>
      {theme === 'light' ? (
        <ToggleBtn onClick={handleThemeMode}>
          <Image width={42} height={42} src={Sun} alt="해 로고" />
        </ToggleBtn>
      ) : (
        <ToggleBtn onClick={handleThemeMode}>
          <Image src={Moon} alt="달 로고" />
        </ToggleBtn>
      )}
    </div>
  )
}

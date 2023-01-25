import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Moon from '../../static/Moon.svg'
import Sun from '../../static/Sun.svg'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function ThemeToggleBtn() {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light')
  const handleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }
  useEffect(() => {
    document.body.dataset.theme = themeMode
  }, [themeMode])
  return (
    <div>
      {themeMode === 'light' ? (
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

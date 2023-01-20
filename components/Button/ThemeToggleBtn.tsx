import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
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
        <ToggleBtn onClick={handleThemeMode}>🌕다크모드🖤</ToggleBtn>
      ) : (
        <ToggleBtn onClick={handleThemeMode}>🌞라이트모드💜</ToggleBtn>
      )}
    </div>
  )
}

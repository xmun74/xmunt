import styled from 'styled-components'
import SunIcon from '@components/icons/SunIcon'
import MoonIcon from '@components/icons/MoonIcon'
import useToggleTheme from '../../lib/hooks/useToggleTheme'

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
  const [theme, toggleThemeMode] = useToggleTheme()

  return (
    <div>
      <ToggleBtn onClick={toggleThemeMode}>
        {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      </ToggleBtn>
    </div>
  )
}

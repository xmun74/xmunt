import styled from 'styled-components'
import SunIcon from '@components/icons/SunIcon'
import MoonIcon from '@components/icons/MoonIcon'
import { themeColor } from '@styles/theme'
import useToggleTheme from '../../lib/hooks/useToggleTheme'

const ToggleBtn = styled.button`
  cursor: pointer;
  border: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 160ms ease;

  &:hover {
    background: ${themeColor.hoverBg};
  }
`

export default function ThemeToggleBtn() {
  const [theme, toggleThemeMode] = useToggleTheme()

  return (
    <ToggleBtn onClick={toggleThemeMode}>
      {theme === 'light' ? (
        <SunIcon />
      ) : (
        <MoonIcon viewBox="0 0 24 24" width={18} height={18} />
      )}
    </ToggleBtn>
  )
}

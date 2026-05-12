import { useThemeContext } from '../theme-context'

const useToggleTheme = () => {
  const { theme, toggleThemeMode } = useThemeContext()

  return [theme, toggleThemeMode] as const
}

export default useToggleTheme

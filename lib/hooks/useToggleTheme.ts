import { useRecoilState } from 'recoil'
import themeState, { ThemeMode } from '../../states/atoms/theme'
import { setLocalStorage } from '../localStorage'

const useToggleTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState)

  const saveThemeMode = (mode: ThemeMode) => {
    setLocalStorage('theme', mode) // CSR
    document.cookie = `theme=${mode}; path=/;` // SSR
    setTheme(mode) // recoil
  }

  const toggleThemeMode = () => {
    return theme === 'light' ? saveThemeMode('dark') : saveThemeMode('light')
  }

  return [theme, toggleThemeMode] as const
}

export default useToggleTheme

import { atom } from 'recoil'

type ThemeMode = 'light' | 'dark'

const themeState = atom<ThemeMode>({
  key: 'themeState',
  default: 'light',
})

export default themeState

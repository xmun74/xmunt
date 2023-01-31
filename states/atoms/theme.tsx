import { atom } from 'recoil'

export type ThemeMode = 'light' | 'dark'

const themeState = atom<ThemeMode>({
  key: 'themeState',
  default: 'light',
})

export default themeState

const storageType = 'local' || 'session'
export const getLocalStorage = (key: string) => {
  try {
    const localStorageValue = JSON.parse(localStorage.getItem(key) as string)
    return localStorageValue
  } catch (error) {
    return console.log(error)
  }
}
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.log(error)
  }
}
export const removeWebStorage = (key: string, type = storageType): void => {
  if (type === 'local') localStorage.removeItem(key)
  else sessionStorage.removeItem(key)
}

export const getSessionStorage = (key: string) => {
  try {
    const sessionStorageValue = JSON.parse(
      sessionStorage.getItem(key) as string
    )
    return sessionStorageValue
  } catch (error) {
    return console.log(error)
  }
}
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.log(error)
  }
}

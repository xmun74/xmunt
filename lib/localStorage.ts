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

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key)
}

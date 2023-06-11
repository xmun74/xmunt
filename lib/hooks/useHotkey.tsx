import { RefObject, useCallback, useEffect } from 'react'

export interface InputProps {
  inputRef: RefObject<HTMLInputElement>
}

/** Search Hotkey : cmd + k */
export default function useHotkey({ inputRef }: InputProps) {
  const PlusOnKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && inputRef?.current !== null) inputRef?.current.focus()
  }
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Meta') document.addEventListener('keydown', PlusOnKeyDown)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
  return null
}

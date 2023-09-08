import { SetStateAction, useCallback, useEffect, useMemo } from 'react'

export interface HotKeysProps {
  comboKeys: string
  label?: string
  global?: boolean
  onKeyDown: (e: React.KeyboardEvent<Element>) => void
}

/* 
const Aliases: { [key: string]: string } = {
  win: 'meta',
  window: 'meta',
  cmd: 'meta',
  command: 'meta',
  ctrl: 'control',
  control: 'control',
  opt: 'alt',
  option: 'alt',
  shift: 'shift',
  esc: 'escape',
  del: 'delete',

  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',

  multiply: '*',
  add: '+',
  subtract: '-',
  decimal: '.',
  divide: '/',
}

const ModifierBitMasks: { [key: string]: number } = {
  alt: 1,
  ctrl: 2,
  meta: 4,
  shift: 8,
}
const getKeyCombo = (e: React.KeyboardEvent<Element>) => {
  const key = e.key.toLowerCase()
  // console.log(key)

  let modifiers = 0
  if (e.altKey) modifiers += ModifierBitMasks.alt
  if (e.ctrlKey) modifiers += ModifierBitMasks.ctrl
  if (e.metaKey) modifiers += ModifierBitMasks.meta
  if (e.shiftKey) modifiers += ModifierBitMasks.shift

  return { modifiers, key }
}
const parsedKeyCombo = (combo: string) => {
  const pieces = combo.toLowerCase().split('+')
  let modifiers = 0
  let key = ''

  pieces.forEach((piece) => {
    if (ModifierBitMasks[piece]) {
      modifiers += ModifierBitMasks[piece]
    } else if (Aliases[piece]) {
      key = Aliases[piece]
    } else {
      key = piece
    }
  })

  return { modifiers, key }
}
const comboMatches = (
  a: { modifiers: number; key: string },
  b: { modifiers: number; key: string }
) => {
  return a.modifiers === b.modifiers && a.key === b.key
}

export default function useHotkey(hotkeys: HotKeysProps[]) {
  const isLocalKey = useMemo(() => hotkeys.filter((k) => !k.global), [hotkeys])
  const isGlobalKey = useMemo(() => hotkeys.filter((k) => k.global), [hotkeys])

  const callback = useCallback(
    (
      comboKeys: { modifiers: number; key: string },
      global: boolean,
      eventType: string,
      e: React.KeyboardEvent<Element>
    ) => {
      const arr = global ? isGlobalKey : isLocalKey
      arr.forEach((hotkey: HotKeysProps) => {
        if (comboMatches(parsedKeyCombo(hotkey.comboKeys), comboKeys)) {
          hotkey[eventType] && hotkey[eventType](e)
        }
      })

      console.log(comboKeys, global, eventType, e)
    },
    [isLocalKey, isGlobalKey]
  )

  const onGlobalKeyDown = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      callback(getKeyCombo(e), true, 'onKeyDown', e)
    },
    [callback]
  )
  const onGlobalKeyUp = useCallback((e: React.KeyboardEvent<Element>) => {
    callback(getKeyCombo(e), true, 'onKeyUp', e)
  }, [])
  const onLocalKeyDown = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      callback(getKeyCombo(e), false, 'onKeyDown', e)
      // console.log('locale down', e.nativeEvent)
    },
    [callback]
  )
  const onLocalKeyUp = useCallback((e: React.KeyboardEvent<Element>) => {
    callback(getKeyCombo(e), false, 'onKeyUp', e)
    // console.log('locale up', e.nativeEvent)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', () => onGlobalKeyDown)
    document.addEventListener('keyup', () => onGlobalKeyUp)
    return () => {
      document.removeEventListener('keydown', () => onGlobalKeyDown)
      document.removeEventListener('keyup', () => onGlobalKeyUp)
    }
  }, [onGlobalKeyDown, onGlobalKeyUp])

  return { handleKeyDown: onLocalKeyDown, handleKeyUp: onLocalKeyUp }
} */

/** Search Hotkey : cmd + k (or Ctrl + k), ESC */

export interface HotKeyProps {
  inputRef: React.RefObject<HTMLInputElement>
  setQuery: React.Dispatch<SetStateAction<string>>
  active?: boolean
  setActive: React.Dispatch<SetStateAction<boolean>>
}
export default function useHotkey({
  inputRef,
  setQuery,
  active,
  setActive,
}: HotKeyProps) {
  const PlusOnKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'k' && inputRef?.current !== null) {
      console.log(e.key)
      inputRef?.current.focus()
    }
  }, [])
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Meta' || e.key === 'Control') {
      console.log(e.key)
      document.addEventListener('keydown', PlusOnKeyDown)
    } else if (e.key === 'Escape') {
      console.log(active, e.key)
      setQuery('')
      setActive(false)
      if (inputRef?.current !== null) inputRef?.current.blur()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // document.removeEventListener('keydown', PlusOnKeyDown)
    }
  }, [handleKeyDown])
  return null
}

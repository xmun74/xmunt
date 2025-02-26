import { useCallback, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { postsApi } from '@lib/apis'
import useHotkey, { HotKeyProps, HotKeysProps } from '@lib/hooks/useHotkey'
import { CachedPost } from '@pages/api/search'
import { themeColor } from '@styles/theme'
import VirtualizedList from './VirtualizedList'

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 8px;

  @media screen and (max-width: 500px) {
    width: 60px;
  }
`
const SearchInput = styled.input`
  position: relative;
  height: 85%;
  width: 130px;
  outline: none;
  border: none;
  border-radius: 5px;
  padding-left: 8px;
  background-color: ${themeColor.inlineCode};
  color: ${themeColor.text3};
  opacity: 0.7;
  &::placeholder {
    color: ${themeColor.text3};
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }
  &:focus {
    opacity: 1;
    transition: 0.15s ease-in-out;
  }
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const SearchResultUl = styled.ul`
  position: fixed;
  top: 55px;
  width: 370px;
  max-width: 370px;
  padding: 0.6rem 0;
  border-radius: 8px;
  box-shadow: ${themeColor.boxShadow};
  background-color: ${themeColor.bg1};
`
const SearchResultLi = styled.li`
  line-height: 1.3rem;
`
const SearchResultLink = styled(Link)`
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 10px 10px;
  margin: 0 10px;
  &:hover {
    background-color: #c3ccdc46;
    border-radius: 5px;
  }
`
const SearchShortCut = styled.div`
  position: absolute;
  right: 10px;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 5px;
  background-color: ${themeColor.bg1};
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  span {
    font-size: 0.9rem;
  }
  @media screen and (max-width: 600px) {
    display: none;
  }
`
const SearchResultsNotFound = styled.div`
  padding: 32px;
  text-align: center;
  opacity: 0.4;
`

export default function SearchBar() {
  const [query, setQuery] = useState<string>('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState<CachedPost[]>([])
  const searchRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useHotkey({ inputRef, setQuery, active, setActive })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /*  const hotkeys: HotKeyProps[] = useMemo(() => {
    return [
      {
        comboKeys: 'meta+k',
        label: 'Search focus',
        global: true,
        onKeyDown: (e: React.KeyboardEvent<Element>) => {
          setActive(true)
          if (inputRef.current !== null) {
            inputRef.current.blur()
          }
          console.log('meta+k', e.nativeEvent)
        },
      },
      {
        comboKeys: 'ctrl+k',
        label: 'Search focus',
        global: true,
        onKeyDown: (e: React.KeyboardEvent<Element>) => {
          setActive(true)
          if (inputRef.current !== null) {
            inputRef.current.blur()
          }
          console.log('ctrl+k', e.nativeEvent)
        },
      },
      {
        label: 'Search blur',
        comboKeys: 'esc',
        onKeyDown: (e: React.KeyboardEvent<Element>) => {
          setQuery('')
          setActive(false)
          console.log('esc', e.nativeEvent)
        },
      },
    ]
  }, []) */
  // const { handleKeyDown } = useHotkey(hotkeys)

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setQuery(value)
      setActive(true)
      if (value.trim().length === 0) setResults([])
      else {
        const data = await postsApi.searchPosts(value)
        setResults(data?.results)
      }
    },
    []
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('')
      setActive(false)
      if (inputRef.current !== null) {
        inputRef.current.blur()
      }
    }
  }

  const handleResultClick = () => {
    setQuery('')
    setActive(false)
  }

  return (
    <SearchBarContainer ref={searchRef}>
      <SearchInput
        value={query}
        placeholder="Search..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {query.length > 0 ? (
        <SearchShortCut>ESC</SearchShortCut>
      ) : (
        <SearchShortCut>
          <span>⌘</span>&nbsp;K
        </SearchShortCut>
      )}

      {active && query.length > 0 && (
        <SearchResultUl>
          {results.length > 0 && (
            <VirtualizedList
              numItems={results && results.length}
              windowHeight={200}
              itemHeight={40}
              renderItem={({ index, style }) => (
                <SearchResultLi
                  key={results[index].slug}
                  style={style}
                  onClick={handleResultClick}
                >
                  <SearchResultLink href={`/blog/${results[index].slug}`}>
                    {results[index].title}
                  </SearchResultLink>
                </SearchResultLi>
              )}
            />
          )}

          {results.length === 0 && (
            <SearchResultsNotFound>
              No document titles found.
            </SearchResultsNotFound>
          )}
        </SearchResultUl>
      )}
    </SearchBarContainer>
  )
}

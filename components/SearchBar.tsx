import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { postsApi } from '../lib/apis'
import useHotkey from '../lib/hooks/useHotkey'
import { CachedPost } from '../pages/api/search'
import { themeColor } from '../styles/theme'

const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 8px;
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
`
const SearchResultUl = styled.ul`
  position: fixed;
  top: 55px;
  width: 370px;
  max-width: 370px;
  padding: 0 0.6rem;
  border-radius: 8px;
  box-shadow: 0px 3px 30px -10px #6666664b;
  background-color: ${themeColor.bg1};
  /* background-color: ${themeColor.gnbBackDrop}; */
  /* backdrop-filter: blur(5px); */
  /* -webkit-backdrop-filter: blur(5px); */
`
const SearchResultLi = styled.li`
  line-height: 1.3rem;
`
const SearchResultLink = styled(Link)`
  height: 2.3rem;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  margin: 10px 0;
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

  useHotkey({ inputRef })

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
    [],
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
      {active && (
        <SearchResultUl>
          {results.length > 0 &&
            results?.map(({ slug, title, content }) => (
              <SearchResultLi key={title} onClick={handleResultClick}>
                <SearchResultLink href={`/blog/${slug}`} key={title}>
                  {title}
                </SearchResultLink>
              </SearchResultLi>
            ))}
          {query.length > 0 && results.length === 0 && (
            <SearchResultsNotFound>
              No document titles found.
            </SearchResultsNotFound>
          )}
        </SearchResultUl>
      )}
    </SearchBarContainer>
  )
}

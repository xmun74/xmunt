import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { postsApi } from '@lib/apis'
import type { CachedPost } from '@lib/types'
import { themeColor } from '@styles/theme'
import VirtualizedList from './VirtualizedList'

const SearchBarContainer = styled.div`
  position: relative;
  margin-right: 0.8rem;
`

const SearchTrigger = styled.button`
  position: relative;
  width: 120px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 0px 8px;
  border: none;
  border-radius: 0.375rem;
  background: ${themeColor.hoverBg};
  color: ${themeColor.text2};

  @media screen and (max-width: 767px) {
    width: 58px;
    padding: 12px;
    justify-content: center;
  }
`

const TriggerLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.875rem;
  font-weight: 200;

  @media screen and (max-width: 767px) {
    display: none;
  }
`

const ShortcutKeycap = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 5px;
  border-radius: 0.375rem;
  background: ${themeColor.bg1};
  color: ${themeColor.text3};
  font-size: 0.775rem;

  @media screen and (max-width: 767px) {
    display: none;
  }
`

const SearchOverlay = styled.div<{ $active: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 6rem 1rem 1.5rem;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
  transition:
    opacity 520ms cubic-bezier(0.32, 0.72, 0, 1),
    backdrop-filter 520ms cubic-bezier(0.32, 0.72, 0, 1);

  @media screen and (max-width: 767px) {
    padding-top: 5rem;
  }
`

const SearchPanelShell = styled.div<{ $active: boolean }>`
  width: min(100%, 880px);
`

const SearchPanelCore = styled.div`
  overflow: hidden;
  border-radius: calc(0.375rem - 1px);
  border: 1px solid ${themeColor.inlineCode};
  background: ${themeColor.bg1};
  color: ${themeColor.text1};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
`

const SearchTop = styled.div`
  position: relative;
  padding: 12px;

  @media screen and (max-width: 767px) {
    padding: 12px;
  }
`

const SearchInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: 767px) {
    align-items: flex-start;
  }
`

const SearchInputWrap = styled.div`
  flex: 1;
  min-width: 0;
`

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${themeColor.text1};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  caret-color: ${themeColor.accent2};

  &::placeholder {
    color: ${themeColor.text3};
  }
`

const SearchMetaText = styled.p`
  margin-top: 0.65rem;
  color: ${themeColor.text3};
  opacity: 0.7;
  font-size: 0.7rem;
`

const EscKeycap = styled.button`
  height: 28px;
  padding: 4px 12px;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 0.375rem;
  background: ${themeColor.bg1};
  color: ${themeColor.text1};
  font-size: 0.875rem;
`

const SearchDivider = styled.div`
  height: 1px;
  background: ${themeColor.inlineCode};
`

const SearchResultsArea = styled.div`
  padding: 8px;
`

const SearchResultLi = styled.li`
  line-height: 1;
`

const SearchResultLink = styled(Link)`
  width: calc(100% - 0.4rem);
  height: 50px;
  margin: 0 0.2rem;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 0.375rem;
  color: ${themeColor.text1};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.8rem;

  &:hover {
    background: ${themeColor.hoverBg};
    color: ${themeColor.text1};
  }
`

const ResultIconShell = styled.span`
  width: 1.95rem;
  height: 1.95rem;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  background: ${themeColor.bg1};
  color: ${themeColor.text3};
`

const ResultText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const SearchResultsNotFound = styled.div`
  padding: 12px;
  text-align: center;
  color: ${themeColor.text3};
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.8rem;
`

function DocGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.25 2.75H10L13 5.75V14.75C13 15.3023 12.5523 15.75 12 15.75H5.25C4.69772 15.75 4.25 15.3023 4.25 14.75V3.75C4.25 3.19772 4.69772 2.75 5.25 2.75Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="M9.75 2.95V6H12.75" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M6.5 8.5H10.75"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M6.5 11H10.75"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState<CachedPost[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const openSearch = useCallback(() => {
    setActive(true)
  }, [])

  const closeSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setActive(false)
    setIsSearching(false)
    inputRef.current?.blur()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!active) return

    inputRef.current?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [active])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isOpenShortcut =
        event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)

      if (isOpenShortcut) {
        event.preventDefault()
        openSearch()
      }

      if (event.key === 'Escape') {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeSearch, openSearch])

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextQuery = event.target.value
      setQuery(nextQuery)
      setActive(true)

      if (nextQuery.trim().length === 0) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      const data = await postsApi.searchPosts(nextQuery)

      if (inputRef.current?.value !== nextQuery) return

      setResults(data?.results ?? [])
      setIsSearching(false)
    },
    []
  )

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeSearch()
    }
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      closeSearch()
    }
  }

  const handleResultClick = () => {
    closeSearch()
  }

  return (
    <SearchBarContainer>
      <SearchTrigger
        type="button"
        onClick={openSearch}
        aria-label="Open search"
      >
        <TriggerLabel>Search...</TriggerLabel>
        <ShortcutKeycap>⌘&nbsp;K</ShortcutKeycap>
      </SearchTrigger>

      {mounted &&
        createPortal(
          <SearchOverlay
            $active={active}
            onClick={handleOverlayClick}
            aria-hidden={!active}
          >
            <SearchPanelShell ref={panelRef} $active={active}>
              <SearchPanelCore>
                <SearchTop>
                  <SearchInputRow>
                    <SearchInputWrap>
                      <SearchInput
                        value={query}
                        placeholder="What are you searching for?"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                      />
                      <SearchMetaText>
                        {query.length > 0
                          ? `${results.length} result${results.length === 1 ? '' : 's'} found`
                          : 'Search by post title. Use command K to open from anywhere.'}
                      </SearchMetaText>
                    </SearchInputWrap>
                    <EscKeycap type="button" onClick={closeSearch}>
                      ESC
                    </EscKeycap>
                  </SearchInputRow>
                </SearchTop>

                <SearchDivider />

                <SearchResultsArea>
                  {query.length === 0 && (
                    <SearchResultsNotFound>
                      Start typing to search through blog post titles.
                    </SearchResultsNotFound>
                  )}

                  {query.length > 0 && results.length > 0 && (
                    <VirtualizedList
                      numItems={results.length}
                      windowHeight={360}
                      itemHeight={60}
                      renderItem={({ index, style }) => (
                        <SearchResultLi
                          key={results[index].slug}
                          style={style}
                          onClick={handleResultClick}
                        >
                          <SearchResultLink
                            href={`/blog/${results[index].slug}`}
                          >
                            <ResultIconShell>
                              <DocGlyph />
                            </ResultIconShell>
                            <ResultText>{results[index].title}</ResultText>
                          </SearchResultLink>
                        </SearchResultLi>
                      )}
                    />
                  )}

                  {query.length > 0 && results.length === 0 && (
                    <SearchResultsNotFound>
                      {isSearching
                        ? 'Searching posts...'
                        : 'No document titles found.'}
                    </SearchResultsNotFound>
                  )}
                </SearchResultsArea>
              </SearchPanelCore>
            </SearchPanelShell>
          </SearchOverlay>,
          document.body
        )}
    </SearchBarContainer>
  )
}

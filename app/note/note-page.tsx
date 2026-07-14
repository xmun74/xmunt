'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import PostDate from '@components/PostDate'
import { NoteType } from '@lib/types'
import { themeColor } from '@styles/theme'

const SectionHeader = styled.div`
  margin-bottom: 1.25rem;
`
const SectionTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
`
const SectionDesc = styled.p`
  margin-top: 0.3rem;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: ${themeColor.text4};
`
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
`
const FilterPill = styled.button<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  height: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.7rem;
  border-radius: 999px;
  border: 1px solid ${themeColor.inlineCode};
  background: ${({ $active }) =>
    $active ? themeColor.inlineCode : 'transparent'};
  color: ${({ $active }) => ($active ? themeColor.text1 : themeColor.text4)};
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    color: ${themeColor.text1};
  }
`
const NoteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`
const NoteItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  transition: background 160ms ease;
  &:hover {
    background: ${themeColor.hoverBg};
  }
`
const NoteTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: ${themeColor.text1};
`
const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`
const TagBadge = styled.span`
  font-size: 0.72rem;
  color: ${themeColor.text4};
  background: ${themeColor.inlineCode};
  padding: 2px 8px;
  border-radius: 999px;
`
const EmptyMsg = styled.p`
  color: ${themeColor.text4};
  font-size: 0.8rem;
  padding: 2rem 0;
  text-align: center;
`

type Props = { allNotes: NoteType[] }

export default function NotePage({ allNotes }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    allNotes.forEach((n) => n.tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [allNotes])

  const filtered = useMemo(
    () =>
      activeTag
        ? allNotes.filter((n) => n.tags?.includes(activeTag))
        : allNotes,
    [allNotes, activeTag]
  )

  return (
    <div>
      <SectionHeader>
        <SectionTitle>노트</SectionTitle>
        <SectionDesc>짧게 정리한 기록 {allNotes.length}개</SectionDesc>
      </SectionHeader>
      <div>
        {allTags.length > 0 && (
          <FilterBar>
            <FilterPill
              type="button"
              aria-pressed={!activeTag}
              $active={!activeTag}
              onClick={() => setActiveTag(null)}
            >
              전체
            </FilterPill>
            {allTags.map((tag) => (
              <FilterPill
                key={tag}
                type="button"
                aria-pressed={activeTag === tag}
                $active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </FilterPill>
            ))}
          </FilterBar>
        )}
        <NoteList>
          {filtered.length === 0 && (
            <EmptyMsg>
              {activeTag
                ? '해당 태그의 노트가 없습니다.'
                : '아직 작성된 노트가 없습니다.'}
            </EmptyMsg>
          )}
          {filtered.map(({ slug, title, date, tags }) => (
            <Link
              key={slug}
              href={`/note/${slug}`}
              style={{ display: 'block' }}
            >
              <NoteItem>
                <NoteTitle>{title}</NoteTitle>
                <NoteMeta>
                  <PostDate date={date} />
                  {tags?.map((t) => (
                    <TagBadge key={t}>#{t}</TagBadge>
                  ))}
                </NoteMeta>
              </NoteItem>
            </Link>
          ))}
        </NoteList>
      </div>
    </div>
  )
}

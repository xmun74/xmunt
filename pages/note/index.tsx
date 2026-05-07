import { useState, useMemo } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import Seo from '@components/Seo'
import Heading from '@components/common/Heading'
import PostDate from '@components/PostDate'
import { getAllNotes } from '@lib/notes'
import { NoteType } from '@lib/types'
import { themeColor } from '@styles/theme'

const TitleWrapper = styled.div`
  position: relative;
`
const HeadingWrapper = styled.div`
  position: absolute;
  top: 6px;
  left: 60px;
`
const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
`
const Body = styled.div`
  padding-top: 80px;
`
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 2rem;
`
const FilterPill = styled.button<{ $active: boolean }>`
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  border: 1px solid
    ${({ $active }) => ($active ? themeColor.accent2 : themeColor.text3)};
  background: ${({ $active }) =>
    $active ? themeColor.accent2 : 'transparent'};
  color: ${({ $active }) => ($active ? themeColor.bg1 : themeColor.text3)};
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.32, 0.72, 0, 1);
`
const NoteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const NoteItem = styled.div`
  padding: 14px 16px;
  border-radius: 8px;
  transition: background 150ms ease;
  &:hover {
    background: ${themeColor.hoverBg};
  }
`
const NoteTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeColor.text1};
  margin-bottom: 6px;
`
const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
const TagBadge = styled.span`
  font-size: 0.72rem;
  color: ${themeColor.text3};
  background: ${themeColor.inlineCode};
  padding: 2px 8px;
  border-radius: 999px;
`
const EmptyMsg = styled.p`
  color: ${themeColor.text3};
  font-size: 0.9rem;
  padding: 2rem 0;
`

type Props = { allNotes: NoteType[] }

export default function Note({ allNotes }: Props) {
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
      <Seo mode="default" />
      <TitleWrapper>
        <ImageWrapper>
          <Image
            src="/images/icons/memo.png"
            alt="Note Icon"
            width={60}
            height={60}
          />
        </ImageWrapper>
        <HeadingWrapper>
          <Heading title="Note" />
        </HeadingWrapper>
      </TitleWrapper>
      <Body>
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
      </Body>
    </div>
  )
}

export const getStaticProps = async () => {
  const allNotes = getAllNotes(['slug', 'title', 'date', 'tags'])
  return { props: { allNotes } }
}

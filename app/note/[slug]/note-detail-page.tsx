import styled from 'styled-components'
import formatPostDate from '@lib/formatDate'
import getReadingMinutes from '@lib/readingTime'
import CalendarIcon from '@components/icons/CalendarIcon'
import ClockIcon from '@components/icons/ClockIcon'
import Header from '@components/Header'
import Footer from '@components/Footer'
import NoteBody from '@components/note/NoteBody'
import NoteToc, { TocItem } from '@components/note/NoteToc'
import NoteCodePanel from '@components/note/NoteCodePanel'
import { PanelBlock } from '@lib/notes'
import { NoteType } from '@lib/types'
import { themeColor } from '@styles/theme'

const PageWrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`

const MainArea = styled.main<{ $hasCodePanel: boolean }>`
  flex: 1;
  margin-top: 60px;
  padding: 4rem 1rem 0;
  width: 100%;
  max-width: ${({ $hasCodePanel }) => ($hasCodePanel ? '520px' : '720px')};
  margin-left: auto;
  margin-right: auto;
  transition: max-width 400ms cubic-bezier(0.32, 0.72, 0, 1);
`

const NoteHeader = styled.div`
  margin-bottom: 3rem;
`

const NoteTitle = styled.h1`
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  color: ${themeColor.text1};
  @media screen and (max-width: 767px) {
    font-size: 1.4rem;
  }
`

const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${themeColor.inlineCode};
`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`

const MetaRight = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex: none;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${themeColor.text4};
`
const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`

const TagBadge = styled.span`
  font-size: 0.75rem;
  color: ${themeColor.text4};
  background: ${themeColor.inlineCode};
  padding: 4px 10px;
  border-radius: 999px;
`

type Props = {
  note: NoteType
  content: string
  panelBlocks: PanelBlock[]
  noteToc: TocItem[]
}

export default function NoteDetailPage({
  note,
  content,
  panelBlocks,
  noteToc,
}: Props) {
  const hasCodePanel = panelBlocks.length > 0
  const readingMinutes = getReadingMinutes(content)

  return (
    <PageWrapper>
      <Header />
      <NoteToc items={noteToc} hasCodePanel={hasCodePanel} />
      <MainArea $hasCodePanel={hasCodePanel}>
        <NoteHeader>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteMeta>
            <TagList>
              {note.tags?.map((t) => (
                <TagBadge key={t}>#{t}</TagBadge>
              ))}
            </TagList>
            <MetaRight>
              <MetaItem>
                <CalendarIcon />
                {formatPostDate(note.date)}
              </MetaItem>
              <MetaItem>
                <ClockIcon />
                {readingMinutes}분 분량
              </MetaItem>
            </MetaRight>
          </NoteMeta>
        </NoteHeader>
        <NoteBody source={content} />
      </MainArea>
      {hasCodePanel && <NoteCodePanel blocks={panelBlocks} />}
      <Footer />
    </PageWrapper>
  )
}

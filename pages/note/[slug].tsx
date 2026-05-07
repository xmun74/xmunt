import { useRouter } from 'next/router'
import styled from 'styled-components'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Seo from '@components/Seo'
import Header from '@components/Header'
import Footer from '@components/Footer'
import NoteBody from '@components/note/NoteBody'
import NoteToc, { TocItem } from '@components/note/NoteToc'
import NoteCodePanel, {
  PanelBlockWithMdx,
} from '@components/note/NoteCodePanel'
import {
  getAllNotes,
  getNoteBySlug,
  getNoteToc,
  extractPanelBlocks,
} from '@lib/notes'
import serializedMdx from '@lib/mdx'
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
  font-weight: 800;
  font-size: 2rem;
  line-height: 1.3;
  margin-bottom: 1.25rem;
  color: ${themeColor.text1};
  @media screen and (max-width: 767px) {
    font-size: 1.6rem;
  }
`

const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${themeColor.hoverBg};
`

const NoteDate = styled.span`
  font-size: 0.82rem;
  color: ${themeColor.text3};
`

const TagBadge = styled.span`
  font-size: 0.72rem;
  color: ${themeColor.text3};
  background: ${themeColor.inlineCode};
  padding: 2px 10px;
  border-radius: 999px;
`

type Props = {
  note: NoteType
  mdx: MDXRemoteSerializeResult
  panelBlocks: PanelBlockWithMdx[]
  noteToc: TocItem[]
}

function NoteDetail({ note, mdx, panelBlocks, noteToc }: Props) {
  const router = useRouter()
  if (!router.isFallback && !note?.slug) return <div>Loading...</div>

  const hasCodePanel = panelBlocks.length > 0

  return (
    <PageWrapper>
      <Seo post={note as any} mode="post" />
      <Header />
      <NoteToc items={noteToc} hasCodePanel={hasCodePanel} />
      <MainArea $hasCodePanel={hasCodePanel}>
        <NoteHeader>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteMeta>
            <NoteDate>{note.date}</NoteDate>
            {note.tags?.map((t) => (
              <TagBadge key={t}>#{t}</TagBadge>
            ))}
          </NoteMeta>
        </NoteHeader>
        <NoteBody mdx={mdx} />
      </MainArea>
      {hasCodePanel && <NoteCodePanel blocks={panelBlocks} />}
      <Footer />
    </PageWrapper>
  )
}

export default Object.assign(NoteDetail, {
  getLayout: (page: React.ReactElement) => page,
})

type Params = { params: { slug: string } }

export async function getStaticProps({ params }: Params) {
  const noteData = getNoteBySlug(params.slug, [
    'slug',
    'title',
    'description',
    'date',
    'content',
    'tags',
  ])

  const { cleanContent, panelBlocks } = extractPanelBlocks(noteData.content)

  const mdx = await serializedMdx(cleanContent)
  const noteToc = getNoteToc(cleanContent)

  const serializedPanelBlocks = await Promise.all(
    panelBlocks.map(async (block) => ({
      ...block,
      mdx: await serializedMdx(`\`\`\`${block.lang}\n${block.code}\n\`\`\``),
    }))
  )

  return {
    props: {
      note: { ...noteData },
      mdx,
      panelBlocks: serializedPanelBlocks,
      noteToc,
    },
  }
}

export async function getStaticPaths() {
  const notes = getAllNotes(['slug'])
  return {
    paths: notes.map((note) => ({ params: { slug: note.slug } })),
    fallback: false,
  }
}

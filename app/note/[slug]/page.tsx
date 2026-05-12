import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import pageConfig from '@lib/config'
import {
  extractPanelBlocks,
  getAllNotes,
  getNoteBySlug,
  getNoteToc,
} from '@lib/notes'
import { NoteType } from '@lib/types'
import NoteDetailPage from './note-detail-page'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const notes = getAllNotes(['slug']) as NoteType[]
  return notes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const note = getNoteBySlug(slug, [
      'slug',
      'title',
      'description',
    ]) as NoteType

    return {
      title: note.title ?? pageConfig.title,
      description: note.description ?? pageConfig.description,
      openGraph: {
        url: `/note/${note.slug}`,
        type: 'website',
        siteName: `${note.title ?? pageConfig.title} | ${pageConfig.title}`,
        title: `${note.title ?? pageConfig.title} | ${pageConfig.title}`,
        description: note.description ?? pageConfig.description,
        images: [pageConfig.siteImg],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${note.title ?? pageConfig.title} | ${pageConfig.title}`,
        description: note.description ?? pageConfig.description,
        images: [pageConfig.siteImg],
      },
    }
  } catch {
    return {
      title: pageConfig.title,
      description: pageConfig.description,
    }
  }
}

export default async function NoteDetail({ params }: PageProps) {
  const { slug } = await params

  try {
    const noteData = getNoteBySlug(slug, [
      'slug',
      'title',
      'description',
      'date',
      'content',
      'tags',
    ]) as NoteType

    const { cleanContent, panelBlocks } = extractPanelBlocks(
      noteData.content ?? ''
    )

    const noteToc = getNoteToc(cleanContent)

    return (
      <NoteDetailPage
        note={noteData}
        content={cleanContent}
        panelBlocks={panelBlocks}
        noteToc={noteToc}
      />
    )
  } catch {
    notFound()
  }
}

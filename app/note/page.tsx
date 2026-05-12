import type { Metadata } from 'next'
import Layout from '@components/Layout'
import { getAllNotes } from '@lib/notes'
import { NoteType } from '@lib/types'
import NotePage from './note-page'

export const metadata: Metadata = {
  title: 'Note',
}

export default function Note() {
  const allNotes = getAllNotes(['slug', 'title', 'date', 'tags']) as NoteType[]

  return (
    <Layout>
      <NotePage allNotes={allNotes} />
    </Layout>
  )
}

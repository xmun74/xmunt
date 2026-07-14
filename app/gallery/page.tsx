import type { Metadata } from 'next'
import Layout from '@components/Layout'
import GalleryPage from './gallery-page'

export const metadata: Metadata = {
  title: 'Gallery',
}

export default function Gallery() {
  return (
    <Layout>
      <GalleryPage />
    </Layout>
  )
}

import type { Metadata } from 'next'
import Layout from '@components/Layout'
import AboutPage from './about-page'

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return (
    <Layout>
      <AboutPage />
    </Layout>
  )
}

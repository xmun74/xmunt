import type { Metadata } from 'next'
import Layout from '@components/Layout'
import ProjectsPage from './projects-page'

export const metadata: Metadata = {
  title: 'Projects',
}

export default function Projects() {
  return (
    <Layout>
      <ProjectsPage />
    </Layout>
  )
}

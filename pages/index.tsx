import Head from 'next/head'
import styled from 'styled-components'
import PreviewContent from '../components/PreviewContent'

const HomeContainer = styled.div``

const SubHeading = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 30px;
`

export default function Home() {
  const previewPosts = [
    {
      href: '/blog/preview',
      title:
        'NextJs + TS 셋팅 - eslint, prettier, styled-components (husky, lint-staged, airbnb)',
      date: '2023-02-07',
      imgUrl: '/images/defaultImg.jpeg',
    },
    {
      href: '/blog/preview',
      title: 'Next.js + TS 초기 셋팅',
      date: '2023-02-07',
      imgUrl: '',
    },
    {
      href: '/blog/preview',
      title: 'Next.js + TS 초기 셋팅',
      date: '2023-02-07',
      imgUrl: '',
    },
  ]
  return (
    <>
      <Head>
        <title>xmunt blog</title>
      </Head>
      <HomeContainer>
        <SubHeading>Featured Posts</SubHeading>
        <PreviewContent previewPosts={previewPosts} />
      </HomeContainer>
    </>
  )
}

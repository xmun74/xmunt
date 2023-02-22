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
  return (
    <>
      <Head>
        <title>xmunt blog</title>
      </Head>
      <HomeContainer>
        <SubHeading>Featured Posts</SubHeading>
        <PreviewContent />
      </HomeContainer>
    </>
  )
}

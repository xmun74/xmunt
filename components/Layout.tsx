'use client'

import styled from 'styled-components'
import { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'

const LayoutDiv = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`
const Content = styled.main`
  flex: 1;
  margin: 60px auto 0 auto;
  max-width: 720px;
  padding-top: 4rem;
  width: 100%;
  @media screen and (max-width: 767px) {
    width: 90%;
  }
`

export default function Layout({ children }: PropsWithChildren) {
  return (
    <LayoutDiv>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </LayoutDiv>
  )
}

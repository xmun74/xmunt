import styled from 'styled-components'
import { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'

const Content = styled.main`
  margin: 60px auto 0 auto;
  max-width: 720px;
  padding-top: 4rem;
  @media screen and (max-width: 767px) {
    width: 90%;
  }
`

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </>
  )
}

import styled from 'styled-components'
import { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'

const Content = styled.main`
  margin: 70px 400px;
  border: 1px solid gray;
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

import Link from 'next/link'
import styled from 'styled-components'
import ThemeToggleBtn from './Button/ThemeToggleBtn'

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid green;
  padding: 0 200px;
`
const Logo = styled.button`
  margin: 10px;
  font-weight: 300;
  border: none;
`
const LinkContainer = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  font-weight: 400;
`

export default function Header() {
  return (
    <Container>
      <Logo>
        <Link href="/">taegyeong mun</Link>
      </Logo>
      <LinkContainer>
        <Link href="/about">ABOUT</Link>
        <Link href="/projects">PROJECTS</Link>
        <Link href="/blog">BLOG</Link>
      </LinkContainer>
      <ThemeToggleBtn />
    </Container>
  )
}

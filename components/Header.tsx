import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { themeColor } from '../styles/theme'
import ThemeToggleBtn from './button/ThemeToggleBtn'
import Logo from '../public/static/Logo.svg'
import LogoDarkMode from '../public/static/LogoDarkMode.svg'
import themeState from '../states/atoms/theme'

const Container = styled.header`
  position: fixed;
  z-index: 10;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${themeColor.accent1};
  margin: 0 auto;
`
const HeaderContent = styled.div`
  min-width: 590px;
  width: 60%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 767px) {
    min-width: 0;
    width: 90%;
    position: absolute;
    top: 0;
    justify-content: space-between;
  }
`
const LogoBtn = styled.button`
  border: none;
  width: 5rem;
`
const LinkContainer = styled.div`
  width: 250px;
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: 20px;
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`
export default function Header() {
  const theme = useRecoilValue(themeState)
  return (
    <Container>
      <HeaderContent>
        <LogoBtn>
          <Link href="/">
            <Image
              src={theme === 'light' ? Logo : LogoDarkMode}
              alt="사이트 로고"
              width={70}
              height={60}
            />
          </Link>
        </LogoBtn>
        <LinkContainer>
          <Link href="/about">ABOUT</Link>
          <Link href="/projects">PROJECTS</Link>
          <Link href="/blog">BLOG</Link>
        </LinkContainer>
        <ThemeToggleBtn />
      </HeaderContent>
    </Container>
  )
}

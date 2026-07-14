'use client'

import Link from 'next/link'
import styled from 'styled-components'
import AnimatedLogo from '@components/AnimatedLogo'
import { useThemeContext } from '@lib/theme-context'
import { themeColor } from '../styles/theme'
import ThemeToggleBtn from './button/ThemeToggleBtn'
import Nav from './Nav'
import SearchBar from './SearchBar'

const Container = styled.header`
  position: fixed;
  z-index: 10;
  top: 0.9rem;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  pointer-events: none;
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
  position: relative;
  border: none;
  width: 60px;
  height: 60px;
  pointer-events: auto;
  @media screen and (max-width: 767px) {
    width: 46px;
  }
`
const PillNav = styled.div`
  pointer-events: auto;
  max-width: 94vw;
  display: flex;
  align-items: center;
  padding: 0.35rem;
  border: 1px solid ${themeColor.inlineCode};
  border-radius: 999px;
  background-color: ${themeColor.gnbBackDrop};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px -12px #6666664b;
`
const Divider = styled.span`
  width: 1px;
  height: 1.375rem;
  margin: 0 0.45rem;
  flex: none;
  background: ${themeColor.inlineCode};
`
const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export default function Header() {
  const { theme } = useThemeContext()
  const isDarkMode = theme === 'dark'

  return (
    <Container>
      <HeaderContent>
        <Link href="/">
          <LogoBtn>
            <AnimatedLogo isDarkMode={isDarkMode} />
          </LogoBtn>
        </Link>
        <PillNav>
          <Nav />
          <Divider />
          <RightGroup>
            <SearchBar />
            <ThemeToggleBtn />
          </RightGroup>
        </PillNav>
      </HeaderContent>
    </Container>
  )
}

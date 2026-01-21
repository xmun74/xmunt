import Link from 'next/link'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import AnimatedLogo from '@components/AnimatedLogo'
import { themeColor } from '../styles/theme'
import ThemeToggleBtn from './button/ThemeToggleBtn'
import themeState from '../states/atoms/theme'
import Nav from './Nav'
import SearchBar from './SearchBar'

const Container = styled.header`
  position: fixed;
  z-index: 10;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  box-shadow: 0px 3px 20px -10px #6666664b;
  background-color: ${themeColor.gnbBackDrop};
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
const HeaderWrap = styled.div`
  display: flex;
`
const LogoBtn = styled.button`
  position: relative;
  border: none;
  width: 60px;
  height: 60px;
  @media screen and (max-width: 767px) {
    width: 46px;
  }
`
export default function Header() {
  const theme = useRecoilValue(themeState)
  const isDarkMode = theme === 'dark'

  return (
    <Container>
      <HeaderContent>
        <Link href="/">
          <LogoBtn>
            <AnimatedLogo isDarkMode={isDarkMode} />
          </LogoBtn>
        </Link>
        <HeaderWrap>
          <SearchBar />
          <Nav />
          <ThemeToggleBtn />
        </HeaderWrap>
      </HeaderContent>
    </Container>
  )
}

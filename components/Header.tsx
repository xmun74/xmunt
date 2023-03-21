import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
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
  width: 70px;
  height: 60px;
  @media screen and (max-width: 767px) {
    width: 55px;
  }
`
export default function Header() {
  const theme = useRecoilValue(themeState)
  const curTheme =
    theme === 'light' ? '/static/Logo.svg' : '/static/LogoDarkMode.svg'

  return (
    <Container>
      <HeaderContent>
        <Link href="/">
          <LogoBtn>
            <Image src={curTheme} alt="사이트 로고" fill />
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

import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { themeColor } from '../styles/theme'
import ThemeToggleBtn from './button/ThemeToggleBtn'
import themeState from '../states/atoms/theme'
import Nav from './Nav'

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
export default function Header() {
  const theme = useRecoilValue(themeState)
  const curTheme =
    theme === 'light' ? '/static/Logo.svg' : '/static/LogoDarkMode.svg'

  return (
    <Container>
      <HeaderContent>
        <LogoBtn>
          <Link href="/">
            <Image src={curTheme} alt="사이트 로고" width={70} height={60} />
          </Link>
        </LogoBtn>
        <Nav />
        <ThemeToggleBtn />
      </HeaderContent>
    </Container>
  )
}

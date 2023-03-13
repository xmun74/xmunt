import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import { themeColor } from '../../styles/theme'

const StyledLink = styled(Link)`
  position: relative;
  color: white;
  margin-right: 0.5rem;
  &:hover {
    background-image: ${themeColor.navBgHoverImg};
    transition: 0.3s ease-in-out;
  }
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 2.5rem;
  height: 2.5rem;
`

const NavHoverLabel = styled.div`
  position: absolute;
  padding: 0.5rem;
  border-radius: 5px;
  text-align: center;
  background-color: ${themeColor.navGuideBg};
  color: ${themeColor.text1};
  font-weight: 300;
  font-size: 0.9rem;
  top: 50px;
`

interface NavProps {
  children: React.ReactNode | React.ReactNode[]
  href: string
  Imgsrc: string
  label: string
  idx: number
}

export default function NavItem({
  children,
  href,
  Imgsrc,
  label,
  idx,
}: NavProps) {
  const router = useRouter()
  const [curHoveredIdx, setCurHoveredIdx] = useState(-1)

  const NavStyle = {
    backgroundImage: `${themeColor.navBgClickImg}`,
  }
  const NavGuideHoverStyle = {
    display: curHoveredIdx === idx ? 'block' : 'none',
  }
  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(href)
  }
  const handleNavGuideHide = () => {
    setCurHoveredIdx(-1)
  }
  const handleNavGuideShow = (i: number) => {
    setCurHoveredIdx(i)
  }

  return (
    <StyledLink
      href={href}
      onClick={handleNavClick}
      onMouseLeave={handleNavGuideHide}
      onMouseEnter={() => handleNavGuideShow(idx)}
      style={router.asPath === href ? NavStyle : {}}
    >
      <Image src={Imgsrc} alt={label} width={20} height={20} />
      <NavHoverLabel style={NavGuideHoverStyle}>{children}</NavHoverLabel>
    </StyledLink>
  )
}

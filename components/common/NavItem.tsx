import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import PlanetIcon from '@components/icons/PlanetIcon'
import { useRecoilValue } from 'recoil'
import themeState from '@states/atoms/theme'
import BlogIcon from '@components/icons/BlogIcon'
import NoteIcon from '@components/icons/NoteIcon'
import PacmanIcon from '@components/icons/PacmanIcon'
import { themeColor } from '@styles/theme'

const StyledLink = styled(Link)`
  position: relative;
  color: white;
  margin-right: 0.5rem;
  &:hover {
    background-color: ${themeColor.navBgHoverImg};
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
  background-color: ${themeColor.navBgHoverImg};
  color: ${themeColor.text1};
  font-weight: 300;
  font-size: 0.65rem;
  top: 50px;
`

type IconKey = 'About' | 'Projects' | 'Blog' | 'Note'

interface NavProps {
  children: React.ReactNode | React.ReactNode[]
  href: string
  label: IconKey
  idx: number
}

interface IconWrapperProps {
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>
  theme: 'dark' | 'light'
}

function IconWrapper({ IconComponent, theme }: IconWrapperProps): JSX.Element {
  const fillColor = theme === 'dark' ? '#7F7F7F' : '#838383'
  return <IconComponent color={fillColor} />
}

export default function NavItem({ children, href, label, idx }: NavProps) {
  const router = useRouter()
  const [curHoveredIdx, setCurHoveredIdx] = useState(-1)
  const theme = useRecoilValue(themeState)

  const NavStyle = {
    backgroundColor: `${themeColor.navBgHoverImg}`,
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

  const types: Record<IconKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
    About: PacmanIcon,
    Projects: PlanetIcon,
    Blog: BlogIcon,
    Note: NoteIcon,
  }

  return (
    <StyledLink
      href={href}
      onClick={handleNavClick}
      onMouseLeave={handleNavGuideHide}
      onMouseEnter={() => handleNavGuideShow(idx)}
      style={router.asPath === href ? NavStyle : {}}
    >
      <IconWrapper IconComponent={types[label]} theme={theme} />

      <NavHoverLabel style={NavGuideHoverStyle}>{children}</NavHoverLabel>
    </StyledLink>
  )
}

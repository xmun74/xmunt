import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactElement } from 'react'
import styled from 'styled-components'
import PlanetIcon from '@components/icons/PlanetIcon'
import { useThemeContext } from '@lib/theme-context'
import BlogIcon from '@components/icons/BlogIcon'
import NoteIcon from '@components/icons/NoteIcon'
import PacmanIcon from '@components/icons/PacmanIcon'
import { themeColor } from '@styles/theme'

const StyledLink = styled(Link)<{
  $theme: 'dark' | 'light'
  $isActive: boolean
}>`
  position: relative;
  color: white;
  margin-right: 0.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  overflow: visible;
  cursor: pointer;

  /* Active 상태일 때 liquid glass 효과 */
  ${(props) =>
    props.$isActive &&
    `
    box-shadow: ${
      props.$theme === 'dark'
        ? 'rgba(0, 0, 0, 0.4) 0px 6px 6px, rgba(0, 0, 0, 0.2) 0px 0px 20px'
        : 'rgba(0, 0, 0, 0.2) 0px 6px 6px, rgba(0, 0, 0, 0.1) 0px 0px 20px'
    };
    padding: 0.15rem;
    border-radius: 20px;

    /* Layer 1: Backdrop blur */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: 20px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      isolation: isolate;
    }

    /* Layer 2: Semi-transparent background */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 10;
      border-radius: 20px;
      background: ${
        props.$theme === 'dark'
          ? 'rgba(159, 159, 159, 0.08)'
          : 'rgba(255, 255, 255, 0.35)'
      };
    }
  `}

  /* Hover 상태일 때도 liquid glass 효과 */
  &:hover {
    box-shadow: ${(props) =>
      props.$theme === 'dark'
        ? 'rgba(0, 0, 0, 0.4) 0px 6px 6px, rgba(0, 0, 0, 0.2) 0px 0px 20px'
        : 'rgba(0, 0, 0, 0.2) 0px 6px 6px, rgba(0, 0, 0, 0.1) 0px 0px 20px'};
    padding: 0.15rem;
    border-radius: 20px;

    /* Layer 1: Backdrop blur */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: 20px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      isolation: isolate;
    }

    /* Layer 2: Semi-transparent background */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 10;
      border-radius: 20px;
      background: ${(props) =>
        props.$theme === 'dark'
          ? 'rgba(159, 159, 159, 0.08)'
          : 'rgba(255, 255, 255, 0.4)'};
    }
  }
`

const ActiveOverlay = styled.div<{ $theme: 'dark' | 'light' }>`
  position: absolute;
  inset: 0;
  z-index: 15;
  border-radius: 20px;
  overflow: hidden;
  background: ${(props) =>
    props.$theme === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.1)'};
  pointer-events: none;
`

const GlassHighlight = styled.div<{ $theme: 'dark' | 'light' }>`
  position: absolute;
  inset: 0;
  z-index: 20;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$theme === 'dark'
      ? 'rgba(255, 255, 255, 0.24) 2px 2px 1px 0px inset, rgba(255, 255, 255, 0.08) -1px -1px 1px 1px inset'
      : 'rgba(255, 255, 255, 0.5) 2px 2px 1px 0px inset, rgba(255, 255, 255, 0.5) -1px -1px 1px 1px inset'};
  pointer-events: none;
`

const IconContainer = styled.div`
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
`

const NavHoverLabel = styled.div<{ $theme: 'dark' | 'light' }>`
  position: absolute;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  text-align: center;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$theme === 'dark'
      ? 'rgba(0, 0, 0, 0.4) 0px 6px 6px, rgba(0, 0, 0, 0.2) 0px 0px 20px'
      : 'rgba(0, 0, 0, 0.2) 0px 3px 3px, rgba(0, 0, 0, 0.1) 0px 0px 1px'};
  color: ${themeColor.text1};
  font-weight: 400;
  font-size: 0.55rem;
  top: 50px;
  white-space: nowrap;
  pointer-events: none;
  letter-spacing: 0.01em;

  /* Layer 1: Backdrop blur */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 6px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    isolation: isolate;
  }

  /* Layer 2: Semi-transparent background */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 10;
    border-radius: 6px;
    background: ${(props) =>
      props.$theme === 'dark'
        ? 'rgba(50, 50, 50, 0.9)'
        : 'rgba(255, 255, 255, 0.85)'};
  }
`

const LabelHighlight = styled.div<{ $theme: 'dark' | 'light' }>`
  position: absolute;
  inset: 0;
  z-index: 20;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$theme === 'dark'
      ? 'rgba(255, 255, 255, 0.2) 1px 1px 1px 0px inset, rgba(255, 255, 255, 0.05) -1px -1px 1px 1px inset'
      : 'rgba(255, 255, 255, 0.3) 1px 1px 1px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset'};
  pointer-events: none;
`

const LabelContent = styled.span`
  position: relative;
  z-index: 30;
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
  isActive: boolean
}

function IconWrapper({
  IconComponent,
  theme,
  isActive,
}: IconWrapperProps): ReactElement {
  let fillColor: string
  if (isActive) {
    fillColor = theme === 'dark' ? '#E0E0E0' : '#505050'
  } else {
    fillColor = theme === 'dark' ? '#E0E0E0' : '#838383'
  }
  return <IconComponent color={fillColor} />
}

export default function NavItem({ children, href, label, idx }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [curHoveredIdx, setCurHoveredIdx] = useState(-1)
  const { theme } = useThemeContext()
  const isActive = pathname === href
  const isHovered = curHoveredIdx === idx

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
      $theme={theme}
      $isActive={isActive}
    >
      {(isActive || isHovered) && (
        <>
          <GlassHighlight $theme={theme} />
          {isActive && <ActiveOverlay $theme={theme} />}
        </>
      )}
      <IconContainer>
        <IconWrapper
          IconComponent={types[label]}
          theme={theme}
          isActive={isActive || isHovered}
        />
      </IconContainer>

      <NavHoverLabel style={NavGuideHoverStyle} $theme={theme}>
        <LabelHighlight $theme={theme} />
        <LabelContent>{children}</LabelContent>
      </NavHoverLabel>
    </StyledLink>
  )
}

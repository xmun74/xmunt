import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import PlanetIcon from '@components/icons/PlanetIcon'
import BlogIcon from '@components/icons/BlogIcon'
import NoteIcon from '@components/icons/NoteIcon'
import PacmanIcon from '@components/icons/PacmanIcon'
import { themeColor } from '@styles/theme'

const StyledLink = styled(Link)<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.25rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  color: ${(props) => (props.$isActive ? themeColor.text1 : themeColor.text4)};
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${(props) =>
    props.$isActive ? themeColor.inlineCode : 'transparent'};
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${(props) =>
      props.$isActive ? themeColor.inlineCode : themeColor.hoverBg};
    color: ${themeColor.text1};
  }

  @media screen and (max-width: 767px) {
    padding: 0 0.55rem;
  }
`

const IconBox = styled.span`
  width: 1.25rem;
  height: 1.25rem;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`

const Label = styled.span`
  font-weight: 200;
  font-size: 0.85rem;
  @media screen and (max-width: 767px) {
    display: none;
  }
`

type IconKey = 'About' | 'Projects' | 'Blog' | 'Note'

interface NavProps {
  children: React.ReactNode | React.ReactNode[]
  href: string
  label: IconKey
}

const types: Record<IconKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  About: PacmanIcon,
  Projects: PlanetIcon,
  Blog: BlogIcon,
  Note: NoteIcon,
}

export default function NavItem({ children, href, label }: NavProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const IconComponent = types[label]

  return (
    <StyledLink href={href} $isActive={isActive} aria-label={label}>
      <IconBox>
        <IconComponent />
      </IconBox>
      <Label>{children}</Label>
    </StyledLink>
  )
}

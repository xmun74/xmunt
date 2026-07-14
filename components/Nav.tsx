import styled from 'styled-components'
import NavItem from './common/NavItem'

type IconKey = 'Gallery' | 'Projects' | 'Blog' | 'Note'

const navConfig: {
  label: IconKey
  path: string
}[] = [
  {
    label: 'Blog',
    path: '/blog',
  },
  {
    label: 'Note',
    path: '/note',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Gallery',
    path: '/gallery',
  },
]

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`

export default function Nav() {
  return (
    <NavContainer>
      {navConfig.map((nav) => (
        <NavItem key={nav.label} href={nav.path} label={nav.label}>
          {nav.label}
        </NavItem>
      ))}
    </NavContainer>
  )
}

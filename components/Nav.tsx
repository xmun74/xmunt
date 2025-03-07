import styled from 'styled-components'
import NavItem from './common/NavItem'

type IconKey = 'About' | 'Projects' | 'Blog' | 'Note'

const navConfig: {
  label: IconKey
  path: string
}[] = [
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Blog',
    path: '/blog',
  },
  {
    label: 'Note',
    path: '/note',
  },
]

const NavContainer = styled.nav`
  display: flex;
  font-weight: 300;
  font-size: 20px;
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`

export default function Nav() {
  return (
    <NavContainer>
      {navConfig.map((nav, idx) => (
        <NavItem key={nav.label} href={nav.path} label={nav.label} idx={idx}>
          {nav.label}
        </NavItem>
      ))}
    </NavContainer>
  )
}

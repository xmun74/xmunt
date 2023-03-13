import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import themeState from '../states/atoms/theme'
import NavItem from './common/NavItem'

const navConfig: {
  label: string
  path: string
  src: string
  darkModeSrc: string
}[] = [
  {
    label: 'About',
    path: '/about',
    src: '/static/About.png',
    darkModeSrc: '/static/DarkmodeAbout.png',
  },
  {
    label: 'Projects',
    path: '/projects',
    src: '/static/Projects.png',
    darkModeSrc: '/static/DarkmodeProject.png',
  },
  {
    label: 'Blog',
    path: '/blog',
    src: '/static/Blog.png',
    darkModeSrc: '/static/DarkmodeBlog.png',
  },
  {
    label: 'Note',
    path: '/note',
    src: '/static/Note.png',
    darkModeSrc: '/static/DarkmodeNote.png',
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
  const theme = useRecoilValue(themeState)

  return (
    <NavContainer>
      {navConfig.map((nav, idx) => (
        <NavItem
          key={nav.label}
          href={nav.path}
          Imgsrc={theme === 'light' ? nav.src : nav.darkModeSrc}
          label={nav.label}
          idx={idx}
        >
          {nav.label}
        </NavItem>
      ))}
    </NavContainer>
  )
}

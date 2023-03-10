import Image from 'next/image'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import themeState from '../states/atoms/theme'

const navLinks: {
  title: string
  link: string
  src: string
  darkModeSrc: string
}[] = [
  {
    title: 'ABOUT',
    link: '/about',
    src: '/static/About.png',
    darkModeSrc: '/static/DarkmodeAbout.png',
  },
  {
    title: 'PROJECTS',
    link: '/projects',
    src: '/static/Projects.png',
    darkModeSrc: '/static/DarkmodeProject.png',
  },
  {
    title: 'BLOG',
    link: '/blog',
    src: '/static/Blog.png',
    darkModeSrc: '/static/DarkmodeBlog.png',
  },
  {
    title: 'NOTE',
    link: '/note',
    src: '/static/Note.png',
    darkModeSrc: '/static/DarkmodeNote.png',
  },
]

const NavItem = styled.nav`
  display: flex;
  font-weight: 300;
  font-size: 20px;
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`
const StyledLink = styled(Link)`
  color: white;
  margin-right: 0.5rem;
  &:hover {
    background-image: linear-gradient(
      to right bottom,
      #ff6802,
      #ff7b1a,
      #ff8b2d,
      #ff9b3f,
      #ffa952,
      #ffa952,
      #ffa952,
      #ffa952,
      #ff9a3f,
      #ff8a2c,
      #ff7919,
      #ff6600
    );
    transition: 0.3s ease-in-out;
  }
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 2.5rem;
  height: 2.5rem;
`

export default function Nav() {
  const theme = useRecoilValue(themeState)
  return (
    <NavItem>
      {navLinks.map((nav) => (
        <StyledLink href={nav.link} key={nav.title}>
          <Image
            src={theme === 'light' ? nav.src : nav.darkModeSrc}
            alt="nav.title"
            width={20}
            height={20}
          />
        </StyledLink>
      ))}
    </NavItem>
  )
}

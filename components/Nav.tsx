import Link from 'next/link'
import styled from 'styled-components'

const navLinks: { title: string; link: string }[] = [
  { title: 'ABOUT', link: '/about' },
  { title: 'PROJECT', link: '/project' },
  { title: 'BLOG', link: '/' },
]

const NavItem = styled.nav`
  width: 250px;
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: 20px;
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`

export default function Nav() {
  return (
    <NavItem>
      {navLinks.map((nav) => (
        <Link href={nav.link} key={nav.title}>
          {nav.title}
        </Link>
      ))}
    </NavItem>
  )
}

import Link from 'next/link'
import styled from 'styled-components'
import pageConfig from '../../lib/config'
import { themeColor } from '../../styles/theme'
import GithubIcon from '../icons/GithubIcon'
import VelogIcon from '../icons/VelogIcon'

const ImgWrap = styled.div`
  display: flex;
`

const ImgDiv = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 1rem;
  svg {
    &:hover {
      opacity: 0.7;
    }
  }
`

export default function AuthorContacts() {
  return (
    <ImgWrap>
      {pageConfig.author.contacts &&
        Object.entries(pageConfig.author.contacts).map(([key, value]) => (
          <ImgDiv key={key}>
            <Link href={value}>
              {key === 'velog' && <VelogIcon fill={`${themeColor.text1}`} />}
              {key === 'github' && <GithubIcon fill={`${themeColor.text1}`} />}
            </Link>
          </ImgDiv>
        ))}
    </ImgWrap>
  )
}

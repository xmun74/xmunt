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
`

export default function AuthorContacts() {
  return (
    <ImgWrap>
      <Link href={pageConfig.author.contacts.velog}>
        <ImgDiv>
          <VelogIcon fill={`${themeColor.text1}`} />
        </ImgDiv>
      </Link>
      <Link href={pageConfig.author.contacts.github}>
        <ImgDiv>
          <GithubIcon fill={`${themeColor.text1}`} />
        </ImgDiv>
      </Link>
    </ImgWrap>
  )
}

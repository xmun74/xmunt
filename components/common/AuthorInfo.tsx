import Image from 'next/image'
import styled from 'styled-components'
import pageConfig from '../../lib/config'
import { themeColor } from '../../styles/theme'
import AuthorContacts from './AuthorContacts'

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 3rem 0;
  padding-top: 2.5rem;
  border-top: 1px solid ${themeColor.inlineCode};
`
const ImgWrap = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  flex: none;
  img {
    border-radius: 50%;
    object-fit: cover;
  }
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`
const AuthorName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${themeColor.text1};
`
const AuthorBio = styled.div`
  font-size: 0.8rem;
  color: ${themeColor.text4};
`

export default function AuthorInfo() {
  return (
    <InfoContainer>
      <ImgWrap>
        <Image
          src={pageConfig.author.img}
          alt="프로필 이미지"
          fill
          priority
          draggable={false}
          sizes="72px"
        />
      </ImgWrap>
      <InfoWrapper>
        <AuthorName>{pageConfig.author.name}</AuthorName>
        <AuthorBio>{pageConfig.author.bio}</AuthorBio>
        <AuthorContacts />
      </InfoWrapper>
    </InfoContainer>
  )
}

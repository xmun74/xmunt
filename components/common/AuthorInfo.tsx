import Image from 'next/image'
import styled from 'styled-components'
import pageConfig from '../../lib/config'
import AuthorContacts from './AuthorContacts'

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5rem;
`
const ImgWrap = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  img {
    border-radius: 50%;
  }
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
`
const AuthorName = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`
const AuthorBio = styled.div`
  font-weight: 200;
  margin-bottom: 1rem;
`

export default function AuthorInfo() {
  return (
    <InfoContainer>
      <ImgWrap>
        <Image
          src={pageConfig.author.img}
          alt="프로필 이미지"
          fill
          sizes="320 640 750"
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

'use client'

import styled from 'styled-components'

const AboutContainer = styled.div``
const AboutTitle = styled.div`
  font-weight: 100;
  font-size: 50px;
  margin-bottom: 50px;
`
const Content = styled.div`
  line-height: 1.7;
`

export default function AboutPage() {
  return (
    <AboutContainer>
      <AboutTitle>taegyeong mun</AboutTitle>
      <Content />
    </AboutContainer>
  )
}

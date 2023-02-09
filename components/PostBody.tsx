import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import styled from 'styled-components'

const Content = styled.article`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  white-space: pre-line;
  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 5px;
  }
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-top: 30px;
  }
  h2 {
    font-size: 28px;
    font-weight: 800;
    margin-top: 25px;
  }
  h3 {
    font-size: 20px;
    font-weight: 800;
    margin-top: 20px;
  }
  h4 {
    font-size: 18px;
    font-weight: 800;
    margin-top: 15px;
  }
  p {
    font-size: 16px;
    line-height: 1.8;
  }
  img {
    width: 100%;
    margin-bottom: auto 10px;
    pointer-events: none;
  }
`

const BodyH1 = styled.h1``
const BodyH2 = styled.h2``
const BodyImg = styled.img``

const CustomComponents = {
  h1({ ...props }) {
    return <BodyH1>{props.children}</BodyH1>
  },
  h2({ ...props }) {
    return <BodyH2>{props.children}</BodyH2>
  },

  img({ ...props }) {
    return <BodyImg>{props.children}</BodyImg>
  },
}

export default function PostBody({ content }: { content: string }) {
  return (
    <Content>
      <ReactMarkdown components={CustomComponents}>{content}</ReactMarkdown>
    </Content>
  )
}

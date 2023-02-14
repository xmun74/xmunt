import styled from 'styled-components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

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

export default function PostBody({ mdx }: { mdx: MDXRemoteSerializeResult }) {
  return (
    <Content>
      <MDXRemote {...mdx} />
    </Content>
  )
}

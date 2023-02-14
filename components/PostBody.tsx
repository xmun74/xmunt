import styled from 'styled-components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { themeColor } from '../styles/theme'

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
    scroll-margin-top: 5rem;
    &:hover {
      .anchor {
        position: absolute;
        margin-left: -1em;
        padding-right: 0.5em;
        cursor: pointer;
        &::after {
          content: '#';
          font-weight: 200;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
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
  }
  img {
    width: 100%;
    margin-bottom: auto 10px;
    pointer-events: none;
  }
  blockquote {
    padding-left: 10px;
    border-left: 10px solid;
    border-left-color: ${themeColor.accent2};
    font-weight: 500;
  }
  li {
    list-style: inside;
    padding-left: 10px;
    &::marker {
      color: ${themeColor.accent2};
    }
  }
  a {
    color: #fa620a;
  }
`

export default function PostBody({ mdx }: { mdx: MDXRemoteSerializeResult }) {
  return (
    <Content>
      <MDXRemote {...mdx} />
    </Content>
  )
}

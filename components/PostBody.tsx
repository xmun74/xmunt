import styled from 'styled-components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { themeColor } from '../styles/theme'

const Content = styled.article`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  line-height: 1.7;
  /* white-space: pre; */
  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 5px;
    scroll-margin-top: 5rem;
    /* rehype-autolink-headings */
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
          border: none;
        }
      }
    }
  }
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-top: 50px;
  }
  h2 {
    font-size: 28px;
    font-weight: 800;
    margin-top: 26px;
  }
  h3 {
    font-size: 24px;
    font-weight: 800;
    margin-top: 22px;
  }
  h4 {
    font-size: 18px;
    font-weight: 800;
    margin-top: 20px;
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
    margin-top: 5px;
    &::marker {
      color: ${themeColor.accent2};
    }
  }
  a {
    color: #fa620a;
    &:hover {
      border-bottom: 1px solid;
    }
  }
`

export default function PostBody({ mdx }: { mdx: MDXRemoteSerializeResult }) {
  return (
    <Content>
      <MDXRemote {...mdx} />
    </Content>
  )
}

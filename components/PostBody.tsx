import styled from 'styled-components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { themeColor } from '../styles/theme'

const Content = styled.article`
  position: relative;
  width: 100%;
  margin-bottom: 100px;
  line-height: 2;
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
  ul,
  ol {
    list-style-position: inline;
    line-height: 2.2;
    padding-inline-start: 1.5em;
    list-style-type: disc;
  }
  li {
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
  .rehype-code-title {
    margin-bottom: -0.7rem;
    padding: 0.3em 0.7em;
    font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console',
      'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono',
      'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier,
      monospace;
    background-color: #50525c;
    color: white;
    z-index: 0;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
  }
  img {
    width: 100%;
    height: auto;
  }
`

export default function PostBody({ mdx }: { mdx: MDXRemoteSerializeResult }) {
  return (
    <Content>
      <MDXRemote {...mdx} />
    </Content>
  )
}

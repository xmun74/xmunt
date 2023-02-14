import { serialize } from 'next-mdx-remote/serialize'

const serializedMdx = (source: string) => {
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: 'mdx',
    },
  })
}

export default serializedMdx

import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export function getMdxRenderOptions() {
  /** @type {import('unified').PluggableList} */
  const rehypePlugins = [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ['anchor'],
        },
      },
    ],
  ]

  /** @type {import('next-mdx-remote/dist/types.js').SerializeOptions} */
  const options = {
    mdxOptions: {
      rehypePlugins,
    },
  }

  return options
}

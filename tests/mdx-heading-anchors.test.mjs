import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { getMdxRenderOptions } from '../lib/mdx-render-options.mjs'

test('mdx headings render ids and anchor links for hash navigation', async () => {
  const content = await MDXRemote({
    source: '## Hello World',
    options: getMdxRenderOptions(),
  })

  const html = renderToStaticMarkup(content)

  assert.match(html, /<h2 id="hello-world">/)
  assert.match(html, /<a class="anchor" href="#hello-world">/)
})

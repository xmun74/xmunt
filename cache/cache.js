/* eslint @typescript-eslint/no-var-requires: "off" */
const fs = require('fs')
const { join } = require('path')
const matter = require('gray-matter')
const prettier = require('prettier')

async function postData() {
  const postsDirectory = join(process.cwd(), '_posts')
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames.map((fileName) => {
    const realSlug = fileName.replace(/\.md$/, '')
    const fullPath = join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    return {
      slug: realSlug,
      title: data.title,
      content, // cache 미사용시 주석
    }
  })
  return prettier.format(
    `export const cachedPosts = ${JSON.stringify(posts)}`,
    {
      parser: 'babel',
      singleQuote: true,
      semi: false,
    }
  )
}

async function createPostCache() {
  const content = await postData()
  fs.writeFileSync('./cache/post.js', content)
  console.log('Posts cached')
}

createPostCache().catch((error) => {
  console.error(error)
  process.exit(1)
})

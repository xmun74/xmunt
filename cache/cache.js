/* eslint @typescript-eslint/no-var-requires: "off" */
const fs = require('fs')
const { join } = require('path')
const matter = require('gray-matter')

function postData() {
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
      // content,
    }
  })
  return `export const cachedPosts = ${JSON.stringify(posts)}`
}

function createPostCache() {
  fs.writeFile('./cache/post.js', postData(), (err) => {
    if (err) console.log(err)
    console.log('Posts cached')
  })
}
createPostCache()

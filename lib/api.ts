import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

// gray-matter: 모든 게시글 추출해서 page의 props로 전달하기

// path.join(경로,...) : 여러 인자면 하나의 경로로 합쳐주기  /  process.cwd() :  프로젝트 폴더 반환함.
const postsDirectory = join(process.cwd(), '_posts') //  /Users/mun/Documents/xmunt/_posts
const fileNames = fs.readdirSync(postsDirectory)

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory) // readdirSync: 비동기 폴더검색  => [ 'pre-rendering.md', 'preview.md' ]
}

// [ 'pre-rendering.md', 'preview.md' ] 각각에 ['title', 'date'] 필드 전송
// slugs.map((slug)=> getPostBySlug(slug, fields) )
export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`) // /Users/mun/Documents/xmunt/_posts/pre-rendering.md
  const fileContents = fs.readFileSync(fullPath, 'utf8') // 해당md 파일 내용전체
  const { data, content } = matter(fileContents) // md파싱하기 - data는 title,date같은 최상위 작성한것 / content는 작성내용

  type Items = {
    [key: string]: string
  }
  const items: Items = {}

  // 필요한 필드 데이터만 추출하기
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

//  getAllPosts(['title', 'date'])
export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs() //  [ 'pre-rendering.md', 'preview.md' ]
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order 날짜 내림차순 정렬
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts //  [ { slug: 'pre-rendering' }, { slug: 'preview' } ]
}

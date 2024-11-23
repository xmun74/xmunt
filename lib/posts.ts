import { join } from 'path'
import fs from 'fs'
import matter from 'gray-matter'

/** _posts 폴더 path
 * @returns /Users/username/Documents/xmunt/_posts
 */
const POST_PATH = join(process.cwd(), '_posts')

/**
 * _posts 폴더 안 모든 글 slug 출력
 * @returns [ 'pre-rendering.md', 'preview.md', ... ]
 */
export function getPostSlugs() {
  return fs.readdirSync(POST_PATH)
}

/** <특정 글> slug에 맞는 fields값(slug, title, date 등) 출력
 * @params - ex) getPostBySlug(params.slug, ['slug', 'title', 'date', ...])
 * @returns - { slug: 'open-graph', title: '블로그 제목', date: '2023-00-00', ...}
 */
export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '') // Remove ".md" from file name
  const fullPath = join(POST_PATH, `${realSlug}.md`) // /Users/username/Documents/xmunt/_posts/pre-rendering.md
  const fileContents = fs.readFileSync(fullPath, 'utf8') // 해당 md 파일 내용전체
  const { data, content } = matter(fileContents) // md 파싱하기 - data는 frontmatter / content는 작성내용

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

/**
 * <모든 글> fields값(slug, title, date 등) 출력
 * @param  fields - ex) getAllPosts(['slug', 'date'])
 * @returns [ { slug: 'pre-rendering', date: '2023-00-00' }, { slug: 'preview', date: '2023-00-00' }, ... ]
 */
export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order 날짜 내림차순 정렬
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

/**
 * Toc - headings 추출
 * @param content
 * @returns text, href, level
 */
export function getPostToc(content: string) {
  const headingLines = content.split('\n').filter((el: string) => {
    return el.match(/(^#{1,3})\s/) // #1-3개까지 있는 문자열 추출
  })

  return headingLines.map((el: any) => {
    let text = el.replace(/^##*\s/, '')
    let textOnly
    if (text.slice(0, 1) === '[') {
      textOnly = text.match(/\[.*\]/gi)
      textOnly += ''
      textOnly = textOnly.split('[').join('')
      textOnly = textOnly.split(']').join('')
      text = textOnly
    }

    let href = text.toLowerCase().replaceAll(' ', '-')
    /* eslint-disable-next-line */
    let hrefRegex = /[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/ ]/gi // 특수문자 -_뺴고 삭제
    href = href.replace(hrefRegex, '')

    let level
    if (el.slice(0, 2) === '# ') {
      level = 1
    } else {
      level = el.slice(0, 3) === '###' ? 3 : 2
    }
    return { text, href, level }
  })
}

/**
 * <최신글 4개> fields값(slug, title, date 등) 출력
 * @param  fields - ex) getRecentPosts(['slug', 'date'])
 * @returns [ { slug: 'pre-rendering', date: '2023-00-00' }, { slug: 'preview', date: '2023-00-00' }, ... ]
 */
export function getRecentPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // 날짜 내림차순 정렬
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts.slice(0, 4)
}

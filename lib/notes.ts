import { join } from 'path'
import fs from 'fs'
import matter from 'gray-matter'

const NOTE_PATH = join(process.cwd(), '_notes')

export function getNoteSlugs() {
  return fs.readdirSync(NOTE_PATH).filter((f) => f.endsWith('.md'))
}

export function getNoteBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(NOTE_PATH, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: { [key: string]: any } = {}

  fields.forEach((field) => {
    if (field === 'slug') items[field] = realSlug
    if (field === 'content') items[field] = content
    if (typeof data[field] !== 'undefined') items[field] = data[field]
  })
  return items
}

export function getAllNotes(fields: string[] = []) {
  const slugs = getNoteSlugs()
  return slugs
    .map((slug) => getNoteBySlug(slug, fields))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getNoteToc(content: string) {
  const headingLines = content
    .split('\n')
    .filter((el: string) => el.match(/(^#{1,3})\s/))

  return headingLines.map((el: string) => {
    let text = el.replace(/^##*\s/, '')
    if (text.slice(0, 1) === '[') {
      let textOnly = (text.match(/\[.*\]/gi) ?? [''])[0]
      textOnly = textOnly.replace(/[[\]]/g, '')
      text = textOnly
    }
    let href = text.toLowerCase().replaceAll(' ', '-')
    /* eslint-disable-next-line */
    const hrefRegex = /[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/ ]/gi
    href = href.replace(hrefRegex, '')
    let level = 2
    if (el.slice(0, 2) === '# ') level = 1
    else if (el.slice(0, 3) === '###') level = 3
    return { text, href, level }
  })
}

export interface PanelBlock {
  lang: string
  filename: string
  code: string
}

export function extractPanelBlocks(content: string): {
  cleanContent: string
  panelBlocks: PanelBlock[]
} {
  const panelBlocks: PanelBlock[] = []
  const panelRegex = /^```(\w+):panel ([^\n]*)\n([\s\S]*?)^```/gm
  const cleanContent = content.replace(
    panelRegex,
    (_match, lang: string, filename: string, code: string) => {
      panelBlocks.push({
        lang,
        filename: filename.trim(),
        code: code.trimEnd(),
      })
      return ''
    }
  )
  return { cleanContent, panelBlocks }
}

export interface PostType {
  slug: string
  title?: string
  description?: string
  coverImage?: string
  image?: string
  date: string
  content?: string
  category?: string
  tags?: string[]
}

export interface NoteType {
  slug: string
  title?: string
  description?: string
  date: string
  content?: string
  tags?: string[]
}

export type CachedPost = {
  slug: string
  title: string
  date?: string
  description?: string
  content?: string
}

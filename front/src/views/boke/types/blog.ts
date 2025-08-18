export interface Blog {
  id: number
  title: string
  author: string
  tags: string[]
  category: string
  createTime: string
  status: 'published' | 'draft'
  content: string
}

export type BlogFormData = Omit<Blog, 'id' | 'author' | 'createTime'>
export interface Blog {
  id: string,
  title: string,
  author: string,
  tags: string,
  category: string,
  createTime: string,
  status: 'published' | 'draft',
  content: string,
  coverImage: string,
}

export type BlogFormData = Omit<Blog, 'id' | 'author' | 'createTime'>
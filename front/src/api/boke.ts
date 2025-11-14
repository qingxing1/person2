import request from '@/utils/request'
import { ApiMethodContants } from './base'

interface BlogFormData {
  id?: string
  title: string
  content: string
  author: string
  tags: string // 以逗号分隔的标签字符串
  category: string
  status: 'published' | 'draft' | string // 可以根据实际状态值扩展
  coverImage?: string // 封面图片URL
}
interface BlogListQuery {
  page?: number
  size?: number
  title?: string
  category?: string
  status?: string
}

// 新增博客
export function addBlog(data: BlogFormData) {
  return request({
    url: '/blog',
    method: ApiMethodContants.POST,
    data
  })
}

// 编辑博客
export function updateBlog(data: BlogFormData) {
  return request({
    url: '/blog',
    method: ApiMethodContants.PUT,
    data
  })
}

// 删除博客
export function deleteBlog(id: string) {
  return request({
    url: `/blog/${id}`,
    method: ApiMethodContants.DELETE
  })
}

// 获取博客详情
export function getBlogDetail(id: string) {
  return request({
    url: `/blog/${id}`,
    method: ApiMethodContants.GET
  })
}

// 获取博客列表
export function getBlogList(query:BlogListQuery) {
  return request({
    url: '/blog/list',
    method: ApiMethodContants.GET,
    params: query
  })
}

// 上传封面图
export function uploadCoverImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/blog/upload/cover',
    method: ApiMethodContants.POST,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传内容图片的接口
export function uploadContentImage(file: File) {
  const formData = new FormData()
  formData.append('files', file)
  return request({
    url: '/blog/upload/images',
    method: ApiMethodContants.POST,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取博客分类列表
export function getBlogCategoryList(): Promise<{ code: number; data: CategoryItem[]; message: string }> {
  return request({
    url: '/blog/config/categories',
    method: ApiMethodContants.GET
  })
}

// 获取博客标签列表
export function getBlogTagList(): Promise<{ code: number; data: TagItem[]; message: string }> {
  return request({
    url: '/blog/config/tags',
    method: ApiMethodContants.GET
  })
}

// 更新博客配置参数类型
// 单个分类或标签的结构
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
}

// 整体响应结构
export interface BlogMetadataResponse {
  categories: CategoryItem[];
  tags: TagItem[];
}
// 更新博客配置
export function updateBlogConfig(data: BlogMetadataResponse): Promise<{ code: number; data: any; message: string }> {
  return request({
    url: '/blog/config',
    method: ApiMethodContants.PUT,
    data
  })
}


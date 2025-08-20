import request from '@/utils/request'
import { ApiMethodContants } from './base'

interface BlogFormData {
  id?: number
  title: string
  content: string
  author: string
  tags: string // 以逗号分隔的标签字符串
  category: string
  status: 'published' | 'draft' | string // 可以根据实际状态值扩展
  viewCount: number
  coverImage: string // 封面图片URL
  images: string // 存储为JSON字符串的图片URL数组
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
export function deleteBlog(id: number) {
  return request({
    url: `/blog/${id}`,
    method: ApiMethodContants.DELETE
  })
}

// 获取博客详情
export function getBlogDetail(id: number) {
  return request({
    url: `/blog/${id}`,
    method: ApiMethodContants.GET
  })
}

// 获取博客列表
export function getBlogList() {
  return request({
    url: '/blog/list',
    method: ApiMethodContants.GET,
  })
}

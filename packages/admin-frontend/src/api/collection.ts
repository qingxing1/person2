import request from '@/utils/request'
import { ApiMethodContants } from '@/api/base'

// 收藏列表参数
interface CollectionListQuery {
  page?: string
  size?: string
  category?: string
  name?: string
}

// 获取收藏列表
export function getCollectionList(query?: CollectionListQuery) {
  return request({
    url: '/collection',
    method: ApiMethodContants.GET,
    params: query
  })
}

interface WebsiteInfo {
  id?: string
  // 网站名称
  name: string
  // 网站URL地址
  url: string
  // 网站图标URL
  icon: string
  // 网站所属分类
  category: string
  // 网站描述信息
  description: string
}

// 新增收藏
export function addCollection(data: WebsiteInfo) {
  return request({
    url: '/collection',
    method: ApiMethodContants.POST,
    data
  })
}

// 修改收藏
export function updateCollection(data: WebsiteInfo) {
  return request({
    url: '/collection',
    method: ApiMethodContants.PUT,
    data
  })
}

// 删除收藏
export function deleteCollection(id: string) {
  return request({
    // 在URL中使用:id作为占位符，将id作为路径参数
    url: `/collection/${id}`,
    method: ApiMethodContants.DELETE,
    // 移除params，因为id已经在路径中
  })
}

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/collection/categories/list',
    method: ApiMethodContants.GET
  })
}

// 根据分类获取收藏列表
export function getCollectionListByCategory(category: string) {
  return request({
    url: '/collection/by-category',
    method: ApiMethodContants.GET,
    params: {
      category
    }
  })
}




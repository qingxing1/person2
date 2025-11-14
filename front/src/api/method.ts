import request from '@/utils/request'
import { ApiMethodContants } from '@/api/base'

interface QueryGetList {
  page?: string
  limit?: string
  title?: string
  difficulty?: string // 等级
  category?: string // 类型
}
// 问题难度类型
type Difficulty = '简单' | '中等' | '困难'
// 问题分类类型
export type Category = '数组' | '字符串' | '链表' | '树' | '哈希表' | '动态规划' | '贪心' | '回溯' | '排序' | '查找'

interface AlgorithmProblem {
  /** 问题标题 */
  title: string
  /** 问题难度 */
  difficulty: Difficulty
  /** 问题分类 */
  category: Category
  /** 问题描述 */
  description: string
  /** 解题思路简述 */
  solution: string
  /** 题解代码 */
  answer: string
}

// 获取方法列表
export function getMethodList(query?: QueryGetList) {
  return request({
    url: '/method/list',
    method: ApiMethodContants.GET,
    params: query
  })
}

// 查询单个
export function getMethodDetail(id: string) {
  return request({
    url: '/method/detail',
    method: ApiMethodContants.GET,
    params: {
      id
    }
  })
}

// 新增
export function addMethod(data: AlgorithmProblem) {
  return request({
    url: '/method',
    method: ApiMethodContants.POST,
    data
  })
}

// 编辑
// 通过 path 传递 id（URL路径参数）
export function updateMethod(id: string, data: AlgorithmProblem) {
  return request({
    url: `/method/${id}`, // 将id嵌入URL路径中
    method: ApiMethodContants.PUT,
    data // 请求体数据
  });
}


// 删除
export function deleteMethod(id: string) {
  return request({
    url: `/method/${id}`,
    method: ApiMethodContants.DELETE,
  })
}

// 获取算法分类
export function getMethodCategoryList() {
  return request({
    url: '/algorithm/problem/config/categories',
    method: ApiMethodContants.GET,
  })
}

// 算法配置传递参数
export interface Item{
  id: string
  name: string
  slug: string
}
export interface MethodConfig {
  categories: Item[]
}
// 更新算法配置
export function updateMethodConfig(data: MethodConfig) {
  return request({
    url: '/algorithm/problem/config',
    method: ApiMethodContants.PUT,
    data
  })
}


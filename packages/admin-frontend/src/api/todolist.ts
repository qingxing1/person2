import request from '@/utils/request'
import { ApiMethodContants } from './base'

// 获取所有记录
export function getAllRecords() {
  return request({
    url: '/todo',
    method: ApiMethodContants.GET
  })
}

interface TodoFormData {
  title: string
  completed:boolean
  priority: '高' | '中' | '低'
}
// 新增记录
export function addRecord(data: TodoFormData) {
  return request({
    url: '/todo',
    method: ApiMethodContants.POST,
    data
  })
}

// 标记为完成
export function markAsCompleted(id: string) {
  return request({
    url: `/todo/${id}/complete`,
    method: ApiMethodContants.PUT
  })
}
// 标记为未完成
export function markAsUncompleted(id: string) {
  return request({
    url: `/todo/${id}/incomplete`,
    method: ApiMethodContants.PUT
  })
}

// 获取统计信息
export function getStatistics() {
  return request({
    url: '/todo/stats',
    method: ApiMethodContants.GET
  })
}
// 删除记录
export function deleteRecord(id: string) {
  return request({
    url: `/todo/${id}`,
    method: ApiMethodContants.DELETE
  })
}

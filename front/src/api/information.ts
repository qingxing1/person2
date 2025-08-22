import request from '@/utils/request'
import { ApiMethodContants } from './base'

type InformationStatus = 'unread' | 'read' 


interface Information {
  page?:number
  size?:number
  status?:InformationStatus
  search?:string
  startDate?:string
  endDate?:string
}

// 获取消息列表
export function getInformationList(data:Information) {
  return request({
    url: '/message',
    method: ApiMethodContants.GET,
    params:data
  })
}

// 标记消息为已读
export function markInformationAsRead(id: string) {
  return request({
    url: `/message/${id}/read`,
    method: ApiMethodContants.PUT
  })
}

// 删除消息
export function deleteInformation(id: string) {
  return request({
    url: `/message/${id}`,
    method: ApiMethodContants.DELETE
  })
}

// 获取未读取消息数量
export function getUnreadCount() {
  return request({
    url: '/message/count/unread',
    method: ApiMethodContants.GET
  })
}




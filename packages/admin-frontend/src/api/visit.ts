import request from '@/utils/request'
import { ApiMethodContants } from './base'

// 获取总访问量
export function getTotalVisit() {
  return request({
    url: '/visit-stats/total',
    method: ApiMethodContants.GET
  })
}

// 获取当天访问量
export function getTodayVisit() {
  return request({
    url: '/visit-stats/today',
    method: ApiMethodContants.GET
  })
}

type TimeRange =  'week' | 'month' | 'nine'
// 趋势图
export function getVisitTrend(period:TimeRange) {
  return request({
    url: '/visit-stats/trend',
    method: ApiMethodContants.GET,
    params: {
      period
    }
  })
}

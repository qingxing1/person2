import request from '@/utils/request'
import { ApiMethodContants } from '@/api/base'

export interface UserInfo {
  // 基本信息（id为必填项）
  id: number
  nickname?: string
  realName?: string
  gender?: '男' | '女' | string
  birthday?: string // 格式为YYYY-MM-DD
  bio?: string

  // 联系方式
  email?: string
  phone?: string
  qq?: string
  wechat?: string

  // 地理位置
  location?: string
  address?: string

  // 专业技能（逗号分隔的字符串）
  skills?: string

  // 工作经历（JSON字符串或解析后的数组）
  workExperience?:
    | string
    | Array<{
        company: string
        position: string
        duration: string
      }>

  // 兴趣爱好（逗号分隔的字符串）
  hobbies?: string

  // 社交媒体
  github?: string
  website?: string

  // 扩展信息
  education?: string
  school?: string
}

// 获取个人信息
export function getPersonInfo() {
  return request({
    url: '/personal',
    method: ApiMethodContants.GET
  })
}

// 更新个人信息
export function updatePersonInfo(data: UserInfo) {

  return request({
    url: '/personal',
    method: ApiMethodContants.PUT,
    data
  })
}

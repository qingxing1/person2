import request from '@/utils/request'
import { ApiMethodContants } from '@/api/base'

export interface UserInfo {
  // 基本信息（id为必填项）
  id: number
  nickname?: string
  realName?: string
  motto?: string
  bio?: string
  gender?: '男' | '女' | string
  birthday?: string // 格式为YYYY-MM-DD

  // 联系方式
  email?: string
  phone?: string
  qq?: string
  wechat?: string

  // 地理位置
  location?: string
  address?: string

  // 专业技能（数组或逗号分隔的字符串）
  skills?: string | string[]

  // 兴趣爱好（数组或逗号分隔的字符串）
  hobbies?: string | string[]

  // 社交媒体
  github?: string
  gitee?: string
  website?: string

  // 教育背景（简化字段）
  degreeSimple?: string
  schoolSimple?: string

  // 教育历史（数组）
  educationHistory?: Array<{
    year: string
    major: string
    degree: string
    school: string
    description?: string
  }>

  // 工作经历（数组）
  workExperience?: Array<{
    year: string
    company: string
    position: string
    description?: string
  }>

  // 项目经历（数组）
  projects?: Array<{
    title: string
    link?: string
    tech?: string[]
    description?: string
  }>

  // 自我评价
  selfEvaluation?: string

  // 时间戳
  createdAt?: string
  updatedAt?: string
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

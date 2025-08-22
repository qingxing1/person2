import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEmail, IsEnum, IsDateString, IsNumber, MaxLength } from 'class-validator'

export class UpdatePersonalInfoDto {
  @ApiProperty({ description: '个人信息ID', required: true })
  @IsNumber({}, { message: 'id 类型错误，正确类型 number' })
  id: number

  // 基本信息 - 全部可选
  @ApiProperty({ description: '用户昵称', required: false })
  @IsString({ message: 'nickname 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(20, { message: '昵称最多20个字符' })
  nickname?: string

  @ApiProperty({ description: '真实姓名', required: false })
  @IsString({ message: 'realName 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(10, { message: '真实姓名最多10个字符' })
  realName?: string

  @ApiProperty({ description: '性别', enum: ['男', '女', '保密'], required: false })
  @IsEnum(['男', '女', '保密'], { message: 'gender 只能是 男、女、保密' })
  @IsOptional()
  gender?: string

  @ApiProperty({ description: '出生日期', required: false })
  @IsDateString({}, { message: 'birthday 类型错误，正确类型 date string' })
  @IsOptional()
  birthday?: Date

  @ApiProperty({ description: '个人简介', required: false })
  @IsString({ message: 'bio 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(200, { message: '个人简介最多200个字符' })
  bio?: string

  // 联系方式 - 全部可选
  @ApiProperty({ description: '邮箱地址', required: false })
  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  @IsOptional()
  email?: string

  @ApiProperty({ description: '手机号码', required: false })
  @IsString({ message: 'phone 类型错误，正确类型 string' })
  @IsOptional()
  phone?: string

  @ApiProperty({ description: 'QQ号码', required: false })
  @IsString({ message: 'qq 类型错误，正确类型 string' })
  @IsOptional()
  qq?: string

  @ApiProperty({ description: '微信号码', required: false })
  @IsString({ message: 'wechat 类型错误，正确类型 string' })
  @IsOptional()
  wechat?: string

  // 地理位置 - 全部可选
  @ApiProperty({ description: '所在地区', required: false })
  @IsString({ message: 'location 类型错误，正确类型 string' })
  @IsOptional()
  location?: string

  @ApiProperty({ description: '详细地址', required: false })
  @IsString({ message: 'address 类型错误，正确类型 string' })
  @IsOptional()
  address?: string

  // 专业技能 - 全部可选
  @ApiProperty({ description: '技术栈(逗号分隔)', required: false })
  @IsString({ message: 'skills 类型错误，正确类型 string' })
  @IsOptional()
  skills?: string



  // 兴趣爱好 - 全部可选
  @ApiProperty({ description: '兴趣标签(逗号分隔)', required: false })
  @IsString({ message: 'hobbies 类型错误，正确类型 string' })
  @IsOptional()
  hobbies?: string

  // 社交媒体 - 全部可选
  @ApiProperty({ description: 'GitHub用户名', required: false })
  @IsString({ message: 'github 类型错误，正确类型 string' })
  @IsOptional()
  github?: string

  @ApiProperty({ description: '个人网站', required: false })
  @IsString({ message: 'website 类型错误，正确类型 string' })
  @IsOptional()
  website?: string

  // 扩展信息 - 全部可选
  @ApiProperty({ description: '教育背景', enum: ['高中', '专科', '本科', '硕士', '博士'], required: false })
  @IsEnum(['高中', '专科', '本科', '硕士', '博士'], { message: 'education 只能是 高中、专科、本科、硕士、博士' })
  @IsOptional()
  education?: string

  @ApiProperty({ description: '毕业院校', required: false })
  @IsString({ message: 'school 类型错误，正确类型 string' })
  @IsOptional()
  school?: string
}
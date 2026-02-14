import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsNotEmpty, MaxLength, IsOptional } from 'class-validator'

export class CreateUserMessageDto {
  @ApiProperty({ description: '用户姓名', example: '张三' })
  @IsString({ message: 'name 类型错误，正确类型 string' })
  @IsNotEmpty({ message: '用户姓名不能为空' })
  @MaxLength(50, { message: '用户姓名最多50个字符' })
  name: string

  @ApiProperty({ description: '用户邮箱', example: 'zhangsan@example.com' })
  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  @IsNotEmpty({ message: '用户邮箱不能为空' })
  @MaxLength(100, { message: '邮箱最多100个字符' })
  email: string

  @ApiProperty({ description: '消息主题', example: '网站反馈建议' })
  @IsString({ message: 'subject 类型错误，正确类型 string' })
  @IsNotEmpty({ message: '消息主题不能为空' })
  @MaxLength(100, { message: '消息主题最多100个字符' })
  subject: string

  @ApiProperty({ description: '消息内容', example: '这是一个测试消息内容...' })
  @IsString({ message: 'content 类型错误，正确类型 string' })
  @IsNotEmpty({ message: '消息内容不能为空' })
  content: string

  @ApiProperty({ description: '用户地址', example: '北京市海淀区中关村', required: false })
  @IsString({ message: 'address 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(200, { message: '用户地址最多200个字符' })
  address?: string
}
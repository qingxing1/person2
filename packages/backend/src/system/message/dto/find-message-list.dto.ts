import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator'
import { Transform } from 'class-transformer'

export class FindMessageListDto {


  @ApiProperty({ description: '统一搜索关键字（匹配姓名/邮箱/主题）', required: false })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsString({ message: 'search 类型错误，正确类型 string' })
  @IsOptional()
  search?: string

  @ApiProperty({ description: '消息状态', enum: ['unread', 'read'], required: false })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsEnum(['unread', 'read'], { message: 'status 只能是 unread 或 read' })
  @IsOptional()
  status?: 'unread' | 'read'

  @ApiProperty({ description: '页码', required: false, default: 1 })
  @Transform(({ value }) => {
    const num = Number(value)
    return isNaN(num) ? 1 : num
  })
  @IsNumber({}, { message: 'page 类型错误，正确类型 number' })
  @IsOptional()
  page?: number = 1

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @Transform(({ value }) => {
    const num = Number(value)
    return isNaN(num) ? 10 : num
  })
  @IsNumber({}, { message: 'size 类型错误，正确类型 number' })
  @IsOptional()
  size?: number = 10

  @ApiProperty({ description: '开始时间', required: false, example: '2024-01-01' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsDateString({}, { message: 'startDate 格式错误，正确格式 YYYY-MM-DD' })
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '结束时间', required: false, example: '2024-12-31' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsDateString({}, { message: 'endDate 格式错误，正确格式 YYYY-MM-DD' })
  @IsOptional()
  endDate?: string
}
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsUrl, IsDateString, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateUserCollectionDto {
  @ApiProperty({ description: '收藏ID', example: 1 })
  @Transform(({ value }) => {
    const num = Number(value)
    if (isNaN(num)) {
      throw new Error('id 必须是有效的数字')
    }
    return num
  })
  @IsNumber({}, { message: 'id 类型错误，正确类型 number' })
  @IsNotEmpty({ message: '收藏ID不能为空' })
  id: number

  @ApiProperty({ description: '网站名称', example: '百度', required: false })
  @IsString({ message: 'name 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(50, { message: '网站名称最多50个字符' })
  name?: string

  @ApiProperty({ description: '网站地址', example: 'https://www.baidu.com', required: false })
  @IsUrl({}, { message: '请输入正确的网站地址' })
  @IsOptional()
  @MaxLength(500, { message: '网站地址最多500个字符' })
  url?: string

  @ApiProperty({ description: '网站图标URL', example: 'https://www.baidu.com/favicon.ico', required: false })
  @IsUrl({}, { message: '请输入正确的图标地址' })
  @IsOptional()
  @MaxLength(500, { message: '图标地址最多500个字符' })
  icon?: string

  @ApiProperty({ description: '收藏分类', example: '搜索引擎', required: false })
  @IsString({ message: 'category 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(20, { message: '分类最多20个字符' })
  category?: string

  @ApiProperty({ description: '备注信息', example: '国内最大的搜索引擎', required: false })
  @IsString({ message: 'description 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(200, { message: '备注最多200个字符' })
  description?: string

  @ApiProperty({ description: '收藏日期', example: '2024-01-15', required: false })
  @IsDateString({}, { message: 'createTime 类型错误，正确类型 date string' })
  @IsOptional()
  createTime?: Date
}
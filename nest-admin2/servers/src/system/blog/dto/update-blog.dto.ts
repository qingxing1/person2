import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, Min, MaxLength, IsNumberString } from 'class-validator'

export class UpdateBlogDto {
  @ApiProperty({ description: 'id' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  id: string

  @ApiProperty({ description: '博客标题', required: false })
  @IsString({ message: 'title 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(255, { message: '标题最多255个字符' })
  readonly title?: string

  @ApiProperty({ description: '博客内容', required: false })
  @IsString({ message: 'content 类型错误, 正确类型 string' })
  @IsOptional()
  readonly content?: string

  @ApiProperty({ description: '作者姓名', required: false })
  @IsString({ message: 'author 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(100, { message: '作者姓名最多100个字符' })
  readonly author?: string

  @ApiProperty({ description: '标签列表', required: false })
  @IsString({ message: 'tags 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(500, { message: '标签最多500个字符' })
  readonly tags?: string

  @ApiProperty({ description: '分类', required: false })
  @IsString({ message: 'category 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50, { message: '分类最多50个字符' })
  readonly category?: string

  @ApiProperty({ description: '状态', enum: ['draft', 'published'], required: false })
  @IsEnum(['draft', 'published'], { message: 'status 只能是 draft 或 published' })
  @IsOptional()
  readonly status?: string

  @ApiProperty({ description: '浏览次数', required: false })
  @IsNumber({}, { message: 'viewCount 类型错误, 正确类型 number' })
  @Min(0, { message: '浏览次数不能小于0' })
  @IsOptional()
  readonly viewCount?: number

  @ApiProperty({ description: '封面图片URL', required: false })
  @IsString({ message: 'coverImage 类型错误，正确类型 string' })
  @IsOptional()
  @MaxLength(500, { message: '封面图片URL最多500个字符' })
  readonly coverImage?: string

  @ApiProperty({ description: '图片列表', required: false })
  @IsString({ message: 'images 类型错误，正确类型 string' })
  @IsOptional()
  readonly images?: string
}
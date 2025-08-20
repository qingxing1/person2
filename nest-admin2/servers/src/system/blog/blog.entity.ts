import { ApiProperty } from '@nestjs/swagger'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'

@Entity('blog_posts')
export class BlogEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @ApiProperty({ description: '博客标题' })
  @Column({ type: 'varchar', length: 255, comment: '博客标题' })
  title: string

  @ApiProperty({ description: '博客内容' })
  @Column({ type: 'longtext', comment: '博客内容(Markdown格式)' })
  content: string

  @ApiProperty({ description: '作者姓名' })
  @Column({ type: 'varchar', length: 100, comment: '作者姓名' })
  author: string

  @ApiProperty({ description: '标签列表' })
  @Column({ type: 'varchar', length: 500, comment: '标签列表(逗号分隔)', nullable: true })
  tags: string

  @ApiProperty({ description: '分类' })
  @Column({ type: 'varchar', length: 50, comment: '分类', nullable: true })
  category: string

  @ApiProperty({ description: '状态', enum: ['draft', 'published'] })
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft', comment: '状态' })
  status: string

  @ApiProperty({ description: '浏览次数' })
  @Column({ type: 'int', default: 0, comment: '浏览次数' })
  viewCount: number

  @ApiProperty({ description: '封面图片URL', required: false })
  @Column({ type: 'varchar', length: 500, comment: '封面图片URL', nullable: true })
  coverImage: string

  @ApiProperty({ description: '图片列表', required: false })
  @Column({ type: 'text', comment: '图片列表(JSON格式)', nullable: true })
  images: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'datetime', name: 'create_time', comment: '创建时间' })
  createTime: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'datetime', name: 'update_time', comment: '更新时间' })
  updateTime: Date
}
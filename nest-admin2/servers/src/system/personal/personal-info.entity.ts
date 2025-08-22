import { ApiProperty } from '@nestjs/swagger'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'

@Entity('personal_info')
export class PersonalInfoEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  // 基本信息
  @ApiProperty({ description: '用户昵称', required: false })
  @Column({ type: 'varchar', length: 20, comment: '用户昵称', nullable: true })
  nickname?: string

  @ApiProperty({ description: '真实姓名', required: false })
  @Column({ type: 'varchar', length: 10, comment: '真实姓名', nullable: true })
  realName?: string

  @ApiProperty({ description: '性别', enum: ['男', '女', '保密'], required: false })
  @Column({ type: 'enum', enum: ['男', '女', '保密'], default: '保密', comment: '性别', nullable: true })
  gender?: string

  @ApiProperty({ description: '出生日期', required: false })
  @Column({ type: 'date', comment: '出生日期', nullable: true })
  birthday?: Date

  @ApiProperty({ description: '个人简介', required: false })
  @Column({ type: 'varchar', length: 200, comment: '个人简介', nullable: true })
  bio?: string

  // 联系方式
  @ApiProperty({ description: '邮箱地址', required: false })
  @Column({ type: 'varchar', length: 255, comment: '邮箱地址', nullable: true })
  email?: string

  @ApiProperty({ description: '手机号码', required: false })
  @Column({ type: 'varchar', length: 20, comment: '手机号码', nullable: true })
  phone?: string

  @ApiProperty({ description: 'QQ号码', required: false })
  @Column({ type: 'varchar', length: 20, comment: 'QQ号码', nullable: true })
  qq?: string

  @ApiProperty({ description: '微信号码', required: false })
  @Column({ type: 'varchar', length: 50, comment: '微信号码', nullable: true })
  wechat?: string

  // 地理位置
  @ApiProperty({ description: '所在地区', required: false })
  @Column({ type: 'varchar', length: 100, comment: '所在地区', nullable: true })
  location?: string

  @ApiProperty({ description: '详细地址', required: false })
  @Column({ type: 'varchar', length: 500, comment: '详细地址', nullable: true })
  address?: string

  // 专业技能
  @ApiProperty({ description: '技术栈(逗号分隔)', required: false })
  @Column({ type: 'text', comment: '技术栈(逗号分隔)', nullable: true })
  skills?: string



  // 兴趣爱好
  @ApiProperty({ description: '兴趣标签(逗号分隔)', required: false })
  @Column({ type: 'text', comment: '兴趣标签(逗号分隔)', nullable: true })
  hobbies?: string

  // 社交媒体
  @ApiProperty({ description: 'GitHub用户名', required: false })
  @Column({ type: 'varchar', length: 100, comment: 'GitHub用户名', nullable: true })
  github?: string

  @ApiProperty({ description: '个人网站', required: false })
  @Column({ type: 'varchar', length: 500, comment: '个人网站', nullable: true })
  website?: string

  // 扩展信息
  @ApiProperty({ description: '教育背景', enum: ['高中', '专科', '本科', '硕士', '博士'], required: false })
  @Column({ type: 'enum', enum: ['高中', '专科', '本科', '硕士', '博士'], comment: '教育背景', nullable: true })
  education?: string

  @ApiProperty({ description: '毕业院校', required: false })
  @Column({ type: 'varchar', length: 255, comment: '毕业院校', nullable: true })
  school?: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '创建时间' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'datetime', name: 'updated_at', comment: '更新时间' })
  updatedAt: Date
}
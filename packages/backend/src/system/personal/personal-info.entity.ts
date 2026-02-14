import { ApiProperty } from '@nestjs/swagger'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'

@Entity('about_me')
export class PersonalInfoEntity {
  @ApiProperty({ description: '唯一标识符' })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  // 基本信息
  @ApiProperty({ description: '昵称', required: false })
  @Column({ type: 'varchar', length: 50, comment: '昵称', nullable: true })
  nickname?: string

  @ApiProperty({ description: '真实姓名', required: false })
  @Column({ type: 'varchar', length: 50, name: 'real_name', comment: '真实姓名', nullable: true })
  realName?: string

  @ApiProperty({ description: '座右铭/个人口号', required: false })
  @Column({ type: 'varchar', length: 200, comment: '座右铭/个人口号', nullable: true })
  motto?: string

  @ApiProperty({ description: '个人详细介绍', required: false })
  @Column({ type: 'text', comment: '个人详细介绍', nullable: true })
  bio?: string

  @ApiProperty({ description: '性别', enum: ['男', '女', '保密'], required: false })
  @Column({ type: 'enum', enum: ['男', '女', '保密'], default: '保密', comment: '性别', nullable: true })
  gender?: string

  @ApiProperty({ description: '出生日期', required: false })
  @Column({ type: 'date', comment: '出生日期', nullable: true })
  birthday?: Date

  // 联系方式
  @ApiProperty({ description: '邮箱地址', required: false })
  @Column({ type: 'varchar', length: 100, comment: '邮箱地址', nullable: true })
  email?: string

  @ApiProperty({ description: '手机号码', required: false })
  @Column({ type: 'varchar', length: 20, comment: '手机号码', nullable: true })
  phone?: string

  @ApiProperty({ description: '微信ID', required: false })
  @Column({ type: 'varchar', length: 50, comment: '微信ID', nullable: true })
  wechat?: string

  @ApiProperty({ description: 'QQ号', required: false })
  @Column({ type: 'varchar', length: 20, comment: 'QQ号', nullable: true })
  qq?: string

  // 地理位置
  @ApiProperty({ description: '所在地区', required: false })
  @Column({ type: 'varchar', length: 100, comment: '所在地区（如：北京市）', nullable: true })
  location?: string

  @ApiProperty({ description: '详细地址', required: false })
  @Column({ type: 'varchar', length: 500, comment: '详细地址', nullable: true })
  address?: string

  // 技能与兴趣
  @ApiProperty({ description: '技术栈列表', required: false, example: '["React", "TypeScript", "Node.js"]' })
  @Column({ type: 'json', comment: '技术栈列表：["React", "TypeScript", "Node.js"]', nullable: true })
  skills?: JSON

  @ApiProperty({ description: '兴趣爱好列表', required: false, example: '["阅读", "健身", "编程"]' })
  @Column({ type: 'json', comment: '兴趣爱好列表：["阅读", "健身", "编程"]', nullable: true })
  hobbies?: JSON

  // 社交媒体
  @ApiProperty({ description: 'GitHub用户名', required: false })
  @Column({ type: 'varchar', length: 50, comment: 'GitHub用户名', nullable: true })
  github?: string

  @ApiProperty({ description: 'Gitee用户名', required: false })
  @Column({ type: 'varchar', length: 50, comment: 'Gitee用户名', nullable: true })
  gitee?: string

  @ApiProperty({ description: '个人网站', required: false })
  @Column({ type: 'varchar', length: 100, comment: '个人网站', nullable: true })
  website?: string

  // 教育信息
  @ApiProperty({ description: '简略学位', required: false })
  @Column({ type: 'varchar', length: 50, name: 'degree_simple', comment: '简略学位（如“硕士”）', nullable: true })
  degreeSimple?: string

  @ApiProperty({ description: '简略学校名称', required: false })
  @Column({ type: 'varchar', length: 100, name: 'school_simple', comment: '简略学校名称', nullable: true })
  schoolSimple?: string

  @ApiProperty({ description: '详细教育经历', required: false, example: '[{"year":"2017-2021","degree":"本科","major":"计算机科学","school":"XX大学","description":"..."}]' })
  @Column({ type: 'json', name: 'education_history', comment: '详细教育经历：[{"year":"2017-2021","degree":"本科","major":"计算机科学","school":"XX大学","description":"..."}]', nullable: true })
  educationHistory?: JSON

  // 工作与项目经历
  @ApiProperty({ description: '工作经历', required: false, example: '[{"year":"2023-至今","position":"全栈工程师","company":"科技公司","description":"..."}]' })
  @Column({ type: 'json', name: 'work_experience', comment: '工作经历：[{"year":"2023-至今","position":"全栈工程师","company":"科技公司","description":"..."}]', nullable: true })
  workExperience?: JSON

  @ApiProperty({ description: '项目经历', required: false, example: '[{"title":"个人博客","description":"...","tech":["React","Node.js"],"link":"https://github.com/xxx"}]' })
  @Column({ type: 'json', comment: '项目经历：[{"title":"个人博客","description":"...","tech":["React","Node.js"],"link":"https://github.com/xxx"}]', nullable: true })
  projects?: JSON

  // 个人评价模块（新增）
  @ApiProperty({ description: '自我评价', required: false })
  @Column({ type: 'text', name: 'self_evaluation', comment: '自我评价：描述个人优势、工作风格、职业理念等', nullable: true })
  selfEvaluation?: string

  // 系统字段
  @ApiProperty({ description: '记录创建时间' })
  @CreateDateColumn({ type: 'datetime', name: 'created_at', comment: '记录创建时间' })
  createdAt: Date

  @ApiProperty({ description: '记录最后更新时间' })
  @UpdateDateColumn({ type: 'datetime', name: 'updated_at', comment: '记录最后更新时间' })
  updatedAt: Date
}
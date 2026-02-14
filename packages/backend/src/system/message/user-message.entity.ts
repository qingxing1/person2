import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('user_messages')
export class UserMessageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, comment: '用户姓名' })
  name: string

  @Column({ type: 'varchar', length: 100, comment: '用户邮箱' })
  email: string

  @Column({ type: 'varchar', length: 100, comment: '消息主题' })
  subject: string

  @Column({ type: 'text', comment: '消息内容' })
  content: string

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '用户地址' })
  address: string

  @CreateDateColumn({ name: 'submit_time', comment: '提交日期时间' })
  submitTime: Date

  @Column({ 
    type: 'enum', 
    enum: ['unread', 'read'], 
    default: 'unread', 
    comment: '消息状态：未读/已读' 
  })
  status: 'unread' | 'read'
}
import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('algorithm_problems')
export class AlgorithmProblemEntity {
  @ApiProperty({ description: '算法问题ID' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @ApiProperty({ description: '题目标题' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string

  @ApiProperty({ description: '难度等级', enum: ['简单', '中等', '困难'] })
  @Column({ type: 'enum', enum: ['简单', '中等', '困难'], default: '中等', nullable: false })
  @Index('idx_difficulty')
  difficulty: '简单' | '中等' | '困难'

  @ApiProperty({ description: '算法分类' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  @Index('idx_category')
  category: string

  @ApiProperty({ description: '题目描述' })
  @Column({ type: 'text', nullable: true })
  description: string

  @ApiProperty({ description: '解题思路' })
  @Column({ type: 'text', nullable: true })
  solution: string

  @ApiProperty({ description: '答案或代码' })
  @Column({ type: 'text', nullable: true })
  answer: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_created_at')
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
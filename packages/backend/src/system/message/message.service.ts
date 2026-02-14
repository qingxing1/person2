import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { UserMessageEntity } from './user-message.entity'
import { CreateUserMessageDto } from './dto/create-user-message.dto'
import { UpdateUserMessageDto } from './dto/update-user-message.dto'
import { FindMessageListDto } from './dto/find-message-list.dto'
import { ResultData } from '../../common/utils/result'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(UserMessageEntity)
    private readonly userMessageRepository: Repository<UserMessageEntity>
  ) {}

  /**
   * 创建用户消息
   */
  async create(createDto: CreateUserMessageDto): Promise<ResultData> {
    try {
      const message = this.userMessageRepository.create({
        ...createDto,
        status: 'unread'
      })
      const saved = await this.userMessageRepository.save(message)
      return ResultData.ok(saved)
    } catch (error) {
      return ResultData.fail(500, '创建消息失败: ' + error.message)
    }
  }

  /**
   * 获取消息列表（支持分页、搜索和时间筛选）
   */
  async findAll(queryDto: FindMessageListDto): Promise<ResultData> {
    try {
      const { page = 1, size = 10, status, startDate, endDate, search } = queryDto
      
      let where: any = {}
      
      // 统一搜索逻辑：优先匹配姓名，其次邮箱，最后主题
      if (search) {
        where = [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { subject: Like(`%${search}%`) }
        ]
      } else {
        where = {}
      }
      
      if (status) {
        if (Array.isArray(where)) {
          where = where.map(condition => ({ ...condition, status }))
        } else {
          where.status = status
        }
      }
      let queryBuilder = this.userMessageRepository.createQueryBuilder('message')
      if (search) {
        // 使用OR条件组合搜索
        queryBuilder = queryBuilder.where(
          'message.name LIKE :search OR message.email LIKE :search OR message.subject LIKE :search',
          { search: `%${search}%` }
        )
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('message.status = :status', { status })
      }

      if (startDate) {
        queryBuilder = queryBuilder.andWhere('message.submitTime >= :startDate', { startDate: new Date(startDate) })
      }

      if (endDate) {
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        queryBuilder = queryBuilder.andWhere('message.submitTime < :endDate', { endDate: end })
      }

      const [list, total] = await queryBuilder
        .orderBy('message.submitTime', 'DESC')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount()

      return ResultData.ok({
        list,
        total,
        page,
        size
      })
    } catch (error) {
      return ResultData.fail(500, '获取消息列表失败: ' + error.message)
    }
  }

  /**
   * 根据ID获取消息详情
   */
  async findOne(id: number): Promise<ResultData> {
    try {
      const message = await this.userMessageRepository.findOne({ where: { id } })
      if (!message) {
        return ResultData.fail(404, '消息不存在')
      }
      return ResultData.ok(message)
    } catch (error) {
      return ResultData.fail(500, '获取消息详情失败: ' + error.message)
    }
  }

  /**
   * 更新消息
   */
  async update(updateDto: UpdateUserMessageDto): Promise<ResultData> {
    try {
      const { id, ...updateData } = updateDto
      
      const existing = await this.userMessageRepository.findOne({ where: { id } })
      if (!existing) {
        return ResultData.fail(404, '消息不存在')
      }

      const updated = await this.userMessageRepository.save({
        ...existing,
        ...updateData
      })

      return ResultData.ok(updated)
    } catch (error) {
      return ResultData.fail(500, '更新消息失败: ' + error.message)
    }
  }

  /**
   * 删除消息
   */
  async remove(id: number): Promise<ResultData> {
    try {
      const result = await this.userMessageRepository.delete(id)
      if (result.affected === 0) {
        return ResultData.fail(404, '消息不存在')
      }
      return ResultData.ok('删除成功')
    } catch (error) {
      return ResultData.fail(500, '删除消息失败: ' + error.message)
    }
  }

  /**
   * 标记消息为已读
   */
  async markAsRead(id: number): Promise<ResultData> {
    try {
      const message = await this.userMessageRepository.findOne({ where: { id } })
      if (!message) {
        return ResultData.fail(404, '消息不存在')
      }

      message.status = 'read'
      const updated = await this.userMessageRepository.save(message)
      return ResultData.ok(updated)
    } catch (error) {
      return ResultData.fail(500, '标记已读失败: ' + error.message)
    }
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount(): Promise<ResultData> {
    try {
      const count = await this.userMessageRepository.count({
        where: { status: 'unread' }
      })
      return ResultData.ok(count)
    } catch (error) {
      return ResultData.fail(500, '获取未读消息数量失败: ' + error.message)
    }
  }
}
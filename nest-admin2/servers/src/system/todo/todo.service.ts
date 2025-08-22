import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TodoEntity } from './todo.entity'
import { CreateTodoDto } from './dto/create-todo.dto'
import { ResultData } from '../../common/utils/result'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) {}

  /**
   * 创建待办事项
   */
  async create(createDto: CreateTodoDto): Promise<ResultData> {
    try {
      const todo = this.todoRepository.create(createDto)
      const saved = await this.todoRepository.save(todo)
      return ResultData.ok(saved)
    } catch (error) {
      return ResultData.fail(500, '创建待办事项失败: ' + error.message)
    }
  }

  /**
   * 获取所有待办事项（简单列表）
   */
  async findAllSimple(): Promise<ResultData> {
    try {
      const list = await this.todoRepository.find({
        order: { createTime: 'DESC' }
      })
      return ResultData.ok(list)
    } catch (error) {
      return ResultData.fail(500, '获取待办事项列表失败: ' + error.message)
    }
  }

  /**
   * 获取统计信息
   */
  async getStats(): Promise<ResultData> {
    try {
      const [total, completedCount] = await Promise.all([
        this.todoRepository.count(),
        this.todoRepository.count({ where: { completed: true } })
      ])

      return ResultData.ok({
        total,
        completedCount,
        pendingCount: total - completedCount,
        completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0
      })
    } catch (error) {
      return ResultData.fail(500, '获取统计信息失败: ' + error.message)
    }
  }

  /**
   * 删除待办事项
   */
  async remove(id: number): Promise<ResultData> {
    try {
      const result = await this.todoRepository.delete(id)
      if (result.affected === 0) {
        return ResultData.fail(404, '待办事项不存在')
      }
      return ResultData.ok('删除成功')
    } catch (error) {
      return ResultData.fail(500, '删除待办事项失败: ' + error.message)
    }
  }

  /**
   * 标记待办事项为完成/未完成
   */
  async toggleComplete(id: number, completed: boolean): Promise<ResultData> {
    try {
      const todo = await this.todoRepository.findOne({ where: { id } })
      if (!todo) {
        return ResultData.fail(404, '待办事项不存在')
      }

      todo.completed = completed
      const updated = await this.todoRepository.save(todo)
      return ResultData.ok(updated)
    } catch (error) {
      return ResultData.fail(500, '更新完成状态失败: ' + error.message)
    }
  }
}
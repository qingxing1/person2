import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VisitStats } from './visit-stats.entity'
import { ResultData } from '../../common/utils/result'

@Injectable()
export class VisitStatsService {
  constructor(
    @InjectRepository(VisitStats)
    private readonly visitStatsRepository: Repository<VisitStats>
  ) {}

  /**
   * 增加访问量（当天）
   * 如果当天记录不存在则创建，存在则加1
   */
  async incrementVisit(): Promise<ResultData> {
    try {
      const today = new Date().toISOString().split('T')[0] // 获取当前日期 YYYY-MM-DD

      // 查找今天的记录
      let todayStats = await this.visitStatsRepository.findOne({
        where: { date: today }
      })

      if (!todayStats) {
        // 今天还没有记录，创建新记录
        todayStats = this.visitStatsRepository.create({
          date: today,
          count: 1
        })
      } else {
        // 今天已有记录，访问量加1
        todayStats.count += 1
      }

      const savedStats = await this.visitStatsRepository.save(todayStats)
      return ResultData.ok({
        date: savedStats.date,
        count: savedStats.count,
        message: '访问量已增加'
      })
    } catch (error) {
      return ResultData.fail(500, '增加访问量失败: ' + error.message)
    }
  }

  /**
   * 获取当天的访问量
   */
  async getTodayStats(): Promise<ResultData> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const todayStats = await this.visitStatsRepository.findOne({
        where: { date: today }
      })

      return ResultData.ok({
        date: today,
        count: todayStats?.count || 0
      })
    } catch (error) {
      return ResultData.fail(500, '获取访问量失败: ' + error.message)
    }
  }

  /**
   * 获取总访问量
   */
  async getTotalVisits(): Promise<ResultData> {
    try {
      const result = await this.visitStatsRepository
        .createQueryBuilder('visit_stats')
        .select('SUM(visit_stats.count)', 'total')
        .getRawOne()

      return ResultData.ok({
        total: parseInt(result.total) || 0
      })
    } catch (error) {
      return ResultData.fail(500, '获取总访问量失败: ' + error.message)
    }
  }

  /**
   * 获取访问趋势数据（用于折线图）
   * @param period 时间段：week-7天，month-30天，nine-90天
   */
  async getVisitTrend(period: string = 'week'): Promise<ResultData> {
    try {
      // 根据参数确定天数
      let days = 7
      switch (period) {
        case 'month':
          days = 30
          break
        case 'nine':
          days = 90
          break
        case 'week':
        default:
          days = 7
          break
      }

      // 使用更简单的查询方式，直接获取实体
      const allStats = await this.visitStatsRepository.find({
        order: { date: 'ASC' }
      })

      // 如果数据库中没有数据，返回空数组
      if (!allStats || allStats.length === 0) {
        return ResultData.ok({
          data: [],
          period: period,
          requestedDays: days,
          actualDays: 0,
          message: '暂无访问数据'
        })
      }

      // 直接转换实体数据
      const trendData = allStats.map(stat => ({
        date: stat.date,
        count: stat.count
      }))

      return ResultData.ok({
        data: trendData,
        period: period,
        requestedDays: days,
        actualDays: trendData.length,
        startDate: trendData[0]?.date,
        endDate: trendData[trendData.length - 1]?.date
      })
    } catch (error) {
      console.error('获取访问趋势失败:', error)
      return ResultData.fail(500, '获取访问趋势失败: ' + error.message)
    }
  }
}
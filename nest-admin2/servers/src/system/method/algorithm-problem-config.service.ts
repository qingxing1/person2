import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from 'typeorm';
import { AlgorithmProblemConfigEntity } from "./algorithm-problem-config.entity";
import { ResultData } from '../../common/utils/result';
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from '../../common/enums/code.enum';

@Injectable()
export class AlgorithmProblemConfigService {
  constructor(
    @InjectRepository(AlgorithmProblemConfigEntity)
    private readonly algorithmConfigRepo: Repository<AlgorithmProblemConfigEntity>,
    @InjectEntityManager()
    private readonly algorithmConfigManager: EntityManager
  ) {}

  /**
   * 获取算法配置
   */
  async getConfig(): Promise<ResultData> {
    const config = await this.algorithmConfigRepo.findOne({
      where: {}
    });
    if (!config) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '配置不存在');
    return ResultData.ok(config);
  }

  /**
   * 更新或创建算法配置
   */
  async updateConfig(categories: Array<{ id: string; name: string; slug: string }>): Promise<ResultData> {
    // 先查找是否有配置
    let config = await this.algorithmConfigRepo.findOne({
      where: {}
    });

    if (config) {
      // 更新配置
      config.categories = categories;
      const res = await this.algorithmConfigManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<AlgorithmProblemConfigEntity>(config);
      });
      if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后重试');
      return ResultData.ok(res);
    } else {
      // 创建配置
      const newConfig = plainToInstance(AlgorithmProblemConfigEntity, { categories });
      const res = await this.algorithmConfigManager.transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<AlgorithmProblemConfigEntity>(newConfig);
      });
      if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
      return ResultData.ok(res);
    }
  }

  /**
   * 获取算法分类
   */
  async getCategories(): Promise<ResultData> {
    const config = await this.algorithmConfigRepo.findOne({
      where: {}
    });
    if (!config) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '配置不存在');
    return ResultData.ok(config.categories || []);
  }
}
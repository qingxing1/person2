import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, Like } from 'typeorm';
import { AlgorithmProblemEntity } from "./algorithm-problem.entity";
import { CreateAlgorithmProblemDto } from './dto/create-algorithm-problem.dto';
import { ResultData } from '../../common/utils/result';
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from '../../common/enums/code.enum';
import { UpdateAlgorithmProblemDto } from './dto/update-algorithm-problem.dto';

@Injectable()
export class AlgorithmProblemService {
  constructor(
    @InjectRepository(AlgorithmProblemEntity)
    private readonly algorithmProblemRepo: Repository<AlgorithmProblemEntity>,
    @InjectEntityManager()
    private readonly algorithmProblemManager: EntityManager
  ) {}

  /** 创建算法问题 */
  async create(dto: CreateAlgorithmProblemDto): Promise<ResultData> {
    const algorithmProblem = plainToInstance(AlgorithmProblemEntity, dto);
    const res = await this.algorithmProblemManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<AlgorithmProblemEntity>(algorithmProblem);
    });
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    return ResultData.ok(res);
  }

  /** 更新算法问题 */
  async update(id: number, dto: UpdateAlgorithmProblemDto): Promise<ResultData> {
    const existing = await this.algorithmProblemRepo.findOne({ where: { id } });
    if (!existing) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '算法问题不存在或已被删除');
    
    const { affected } = await this.algorithmProblemManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<AlgorithmProblemEntity>(AlgorithmProblemEntity, id, dto);
    });
    
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    return ResultData.ok();
  }

  /** 删除算法问题 */
  async delete(id: number): Promise<ResultData> {
    const existing = await this.algorithmProblemRepo.findOne({ where: { id } });
    if (!existing) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '算法问题不存在或已被删除');
    
    const { affected } = await this.algorithmProblemManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.delete<AlgorithmProblemEntity>(AlgorithmProblemEntity, id);
    });
    
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除算法问题失败，请稍后尝试');
    return ResultData.ok();
  }

  /** 查询所有算法问题 */
  async findAll(query?: { title?: string, category?: string, difficulty?: string }): Promise<ResultData> {
    const where: any = {};
    
    if (query?.title) {
      where.title = Like(`%${query.title}%`);
    }
    
    if (query?.category) {
      where.category = query.category;
    }
    
    if (query?.difficulty) {
      where.difficulty = query.difficulty;
    }
    
    const problems = await this.algorithmProblemRepo.find({
      where,
      order: { createdAt: 'DESC' }
    });
    
    return ResultData.ok(problems);
  }

  /** 查询单个算法问题 */
  async findOne(id: number): Promise<ResultData> {
    const problem = await this.algorithmProblemRepo.findOne({ where: { id } });
    if (!problem) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '算法问题不存在或已被删除');
    
    return ResultData.ok(problem);
  }
}
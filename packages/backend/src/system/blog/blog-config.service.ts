import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { BlogConfigEntity } from "./blog-config.entity";
import { ResultData } from "../../common/utils/result";
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from "../../common/enums/code.enum";

@Injectable()
export class BlogConfigService {
  constructor(
    @InjectRepository(BlogConfigEntity)
    private readonly blogConfigRepo: Repository<BlogConfigEntity>,
    @InjectEntityManager()
    private readonly blogConfigManager: EntityManager
  ) {}

  /**
   * 获取博客配置
   */
  async getConfig(): Promise<ResultData> {
    const config = await this.blogConfigRepo.findOne({
      where: {},
    });
    if (!config)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "配置不存在");
    return ResultData.ok(config);
  }

  /**
   * 更新或创建博客配置
   */
  async updateConfig(
    categories: Array<{ id: string; name: string; slug: string }>,
    tags: Array<{ id: string; name: string; slug: string }>
  ): Promise<ResultData> {
    // 先查找是否有配置
    const config = await this.blogConfigRepo.findOne({
      where: {},
    });

    if (config) {
      // 更新配置
      config.categories = categories;
      config.tags = tags;
      const res = await this.blogConfigManager.transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save<BlogConfigEntity>(
            config
          );
        }
      );
      if (!res)
        return ResultData.fail(
          AppHttpCode.SERVICE_ERROR,
          "更新失败，请稍后重试"
        );
      return ResultData.ok(res);
    } else {
      // 创建配置
      const newConfig = plainToInstance(BlogConfigEntity, { categories, tags });
      const res = await this.blogConfigManager.transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save<BlogConfigEntity>(
            newConfig
          );
        }
      );
      if (!res)
        return ResultData.fail(
          AppHttpCode.SERVICE_ERROR,
          "创建失败，请稍后重试"
        );
      return ResultData.ok(res);
    }
  }

  /**
   * 获取博客分类
   */
  async getCategories(): Promise<ResultData> {
    const config = await this.blogConfigRepo.findOne({
      where: {},
    });
    if (!config)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "配置不存在");
    return ResultData.ok(config.categories || []);
  }

  /**
   * 获取博客标签
   */
  async getTags(): Promise<ResultData> {
    const config = await this.blogConfigRepo.findOne({
      where: {},
    });
    if (!config)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "配置不存在");
    return ResultData.ok(config.tags || []);
  }
}

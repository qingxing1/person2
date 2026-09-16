import { Controller, Get, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { ApiResult } from "../../common/decorators/api-result.decorator";
import { ResultData } from "../../common/utils/result";
import { AlgorithmProblemConfigService } from "./algorithm-problem-config.service";
import { AlgorithmProblemConfigEntity } from "./algorithm-problem-config.entity";

@ApiTags("算法题目模块")
@ApiBearerAuth()
@Controller("algorithm/problem/config")
export class AlgorithmProblemConfigController {
  constructor(
    private readonly algorithmConfigService: AlgorithmProblemConfigService
  ) {}

  @Get()
  @ApiOperation({ summary: "获取算法配置" })
  @ApiResult(AlgorithmProblemConfigEntity)
  async getConfig(): Promise<ResultData> {
    return this.algorithmConfigService.getConfig();
  }

  @Get("categories")
  @ApiOperation({ summary: "获取算法分类" })
  @ApiResult()
  async getCategories(): Promise<ResultData> {
    return this.algorithmConfigService.getCategories();
  }

  @Put()
  @ApiOperation({ summary: "更新或创建算法配置" })
  @ApiResult(AlgorithmProblemConfigEntity)
  async updateConfig(
    @Body("categories")
    categories: Array<{ id: string; name: string; slug: string }>
  ): Promise<ResultData> {
    return this.algorithmConfigService.updateConfig(categories);
  }
}

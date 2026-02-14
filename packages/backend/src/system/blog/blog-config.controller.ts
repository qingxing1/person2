import { Controller, Get, Put, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ApiResult } from '../../common/decorators/api-result.decorator';
import { ResultData } from '../../common/utils/result';
import { BlogConfigService } from './blog-config.service';
import { BlogConfigEntity } from './blog-config.entity';

@ApiTags('博客模块')
@ApiBearerAuth()
@Controller('blog/config')
export class BlogConfigController {
  constructor(private readonly blogConfigService: BlogConfigService) {}

  @Get()
  @ApiOperation({ summary: '获取博客配置' })
  @ApiResult(BlogConfigEntity)
  async getConfig(): Promise<ResultData> {
    return this.blogConfigService.getConfig();
  }

  @Get('categories')
  @ApiOperation({ summary: '获取博客分类' })
  @ApiResult()
  async getCategories(): Promise<ResultData> {
    return this.blogConfigService.getCategories();
  }

  @Get('tags')
  @ApiOperation({ summary: '获取博客标签' })
  @ApiResult()
  async getTags(): Promise<ResultData> {
    return this.blogConfigService.getTags();
  }

  @Put()
  @ApiOperation({ summary: '更新或创建博客配置' })
  @ApiResult(BlogConfigEntity)
  async updateConfig(@Body('categories') categories: Array<{ id: string; name: string; slug: string }>, @Body('tags') tags: Array<{ id: string; name: string; slug: string }>): Promise<ResultData> {
    return this.blogConfigService.updateConfig(categories, tags);
  }
}
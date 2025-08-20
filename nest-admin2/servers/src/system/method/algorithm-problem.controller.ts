import { Controller, Get, Post, Put, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { ApiResult } from '../../common/decorators/api-result.decorator';
import { ResultData } from '../../common/utils/result';

import { AlgorithmProblemEntity } from './algorithm-problem.entity';
import { AlgorithmProblemService } from './algorithm-problem.service';

import { CreateAlgorithmProblemDto } from './dto/create-algorithm-problem.dto';
import { UpdateAlgorithmProblemDto } from './dto/update-algorithm-problem.dto';

@ApiTags('算法问题模块')
@ApiBearerAuth()
@Controller('method')
export class AlgorithmProblemController {
  constructor(private readonly algorithmProblemService: AlgorithmProblemService) {}

  @Post()
  @ApiOperation({ summary: '创建算法问题' })
  @ApiResult(AlgorithmProblemEntity)
  async create(@Body() dto: CreateAlgorithmProblemDto): Promise<ResultData> {
    return this.algorithmProblemService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新算法问题' })
  @ApiResult()
  async update(@Param('id') id: number, @Body() dto: UpdateAlgorithmProblemDto): Promise<ResultData> {
    return this.algorithmProblemService.update(id, dto);
  }

  @Get('list')
  @ApiOperation({ summary: '查询算法问题列表' })
  @ApiQuery({ name: 'title', required: false, description: '题目标题(模糊查询)' })
  @ApiQuery({ name: 'category', required: false, description: '算法分类' })
  @ApiQuery({ name: 'difficulty', required: false, description: '难度等级', enum: ['简单', '中等', '困难'] })
  @ApiResult(AlgorithmProblemEntity, true)
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string
  ): Promise<ResultData> {
    return this.algorithmProblemService.findAll({ title, category, difficulty });
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个算法问题' })
  @ApiResult(AlgorithmProblemEntity)
  async findOne(@Param('id') id: number): Promise<ResultData> {
    return this.algorithmProblemService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除算法问题' })
  @ApiResult()
  async delete(@Param('id') id: number): Promise<ResultData> {
    return this.algorithmProblemService.delete(id);
  }
}
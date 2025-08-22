import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CollectionService } from './collection.service'
import { CreateUserCollectionDto } from './dto/create-user-collection.dto'
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto'
import { FindCollectionListDto } from './dto/find-collection-list.dto'
import { ResultData } from '../../common/utils/result'

@ApiTags('用户网站收藏管理')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @ApiOperation({ summary: '创建收藏' })
  @ApiResponse({ status: 200, description: '创建成功' })
  async create(@Body() createDto: CreateUserCollectionDto): Promise<ResultData> {
    return await this.collectionService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: '获取收藏列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() findDto: FindCollectionListDto): Promise<ResultData> {
    return await this.collectionService.findAll(findDto)
  }

  @Get('categories/list')
  @ApiOperation({ summary: '获取分类列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getCategories(): Promise<ResultData> {
    return await this.collectionService.getCategories()
  }

  @Get('by-category')
  @ApiOperation({ summary: '按分类获取收藏' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByCategory(@Query('category') category: string): Promise<ResultData> {
    if (!category) {
      return ResultData.fail(400, '分类参数不能为空')
    }
    return await this.collectionService.findByCategory(category)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取收藏详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string): Promise<ResultData> {
    const numericId = Number(id)
    if (isNaN(numericId)) {
      return ResultData.fail(400, 'ID参数必须是有效的数字')
    }
    return await this.collectionService.findOne(numericId)
  }

  @Put()
  @ApiOperation({ summary: '更新收藏' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Body() updateDto: UpdateUserCollectionDto): Promise<ResultData> {
    return await this.collectionService.update(updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除收藏' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string): Promise<ResultData> {
    const numericId = Number(id)
    if (isNaN(numericId)) {
      return ResultData.fail(400, 'ID参数必须是有效的数字')
    }
    return await this.collectionService.remove(numericId)
  }
}
import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger'
import { PersonalService } from './personal.service'
import { CreatePersonalInfoDto } from './dto/create-personal-info.dto'
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto'
import { ResultData } from '../../common/utils/result'
import { AllowAnon } from '../../common/decorators/allow-anon.decorator'

@ApiTags('个人信息管理')
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  /**
   * 创建个人信息
   */
  @Post()
  @ApiOperation({ summary: '创建个人信息' })
  @ApiBody({ type: CreatePersonalInfoDto })
  @ApiResponse({ status: 200, description: '创建成功', type: ResultData })
  async create(@Body() createDto: CreatePersonalInfoDto): Promise<ResultData> {
    return this.personalService.create(createDto)
  }

  /**
   * 获取所有个人信息列表
   */
  @Get()
  @AllowAnon()
  @ApiOperation({ summary: '获取个人信息列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: ResultData })
  async findAll(): Promise<ResultData> {
    return this.personalService.findAll()
  }

  /**
   * 根据ID获取个人信息
   */
  @Get(':id')
  @AllowAnon()
  @ApiOperation({ summary: '根据ID获取个人信息' })
  @ApiParam({ name: 'id', description: '个人信息ID', type: Number })
  @ApiResponse({ status: 200, description: '获取成功', type: ResultData })
  async findOne(@Param('id') id: string): Promise<ResultData> {
    return this.personalService.findOne(+id)
  }

  /**
   * 更新个人信息
   */
  @Put()
  @ApiOperation({ summary: '更新个人信息' })
  @ApiBody({ type: UpdatePersonalInfoDto })
  @ApiResponse({ status: 200, description: '更新成功', type: ResultData })
  async update(@Body() updateDto: UpdatePersonalInfoDto): Promise<ResultData> {
    return this.personalService.update(updateDto)
  }

  /**
   * 删除个人信息
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除个人信息' })
  @ApiParam({ name: 'id', description: '个人信息ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功', type: ResultData })
  async remove(@Param('id') id: string): Promise<ResultData> {
    return this.personalService.remove(+id)
  }
}
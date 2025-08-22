import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { TodoService } from './todo.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { ResultData } from '../../common/utils/result'

@ApiTags('待办事项管理')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: '新增待办事项' })
  async create(@Body() createDto: CreateTodoDto): Promise<ResultData> {
    return this.todoService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: '获取所有待办事项' })
  async findAll(): Promise<ResultData> {
    return this.todoService.findAllSimple()
  }

  @Get('stats')
  @ApiOperation({ summary: '获取待办事项统计' })
  async getStats(): Promise<ResultData> {
    return this.todoService.getStats()
  }

  @Put(':id/complete')
  @ApiOperation({ summary: '标记为完成' })
  @ApiParam({ name: 'id', description: '待办事项ID', type: Number })
  async markComplete(@Param('id') id: string): Promise<ResultData> {
    return this.todoService.toggleComplete(+id, true)
  }

  @Put(':id/incomplete')
  @ApiOperation({ summary: '标记为未完成' })
  @ApiParam({ name: 'id', description: '待办事项ID', type: Number })
  async markIncomplete(@Param('id') id: string): Promise<ResultData> {
    return this.todoService.toggleComplete(+id, false)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除待办事项' })
  @ApiParam({ name: 'id', description: '待办事项ID', type: Number })
  async remove(@Param('id') id: string): Promise<ResultData> {
    return this.todoService.remove(+id)
  }
}
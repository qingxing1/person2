import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { MessageService } from "./message.service";
import { CreateUserMessageDto } from "./dto/create-user-message.dto";
import { UpdateUserMessageDto } from "./dto/update-user-message.dto";
import { FindMessageListDto } from "./dto/find-message-list.dto";
import { ResultData } from "../../common/utils/result";
import { AllowAnon } from "../../common/decorators/allow-anon.decorator";

@ApiTags("用户消息管理")
@Controller("message")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * 创建用户消息
   */
  @Post()
  @AllowAnon()
  @ApiOperation({ summary: "创建用户消息" })
  @ApiBody({ type: CreateUserMessageDto })
  @ApiResponse({ status: 200, description: "创建成功", type: ResultData })
  async create(@Body() createDto: CreateUserMessageDto): Promise<ResultData> {
    return this.messageService.create(createDto);
  }

  /**
   * 获取消息列表（支持分页、搜索和时间筛选）
   */
  @Get()
  @ApiOperation({ summary: "获取消息列表" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "页码",
  })
  @ApiQuery({
    name: "size",
    required: false,
    type: Number,
    description: "每页数量",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "统一搜索关键字（匹配姓名/邮箱/主题）",
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["unread", "read"],
    description: "消息状态",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    type: String,
    description: "开始时间，格式：YYYY-MM-DD",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    type: String,
    description: "结束时间，格式：YYYY-MM-DD",
  })
  @ApiResponse({ status: 200, description: "获取成功", type: ResultData })
  async findAll(@Query() queryDto: FindMessageListDto): Promise<ResultData> {
    return this.messageService.findAll(queryDto);
  }

  /**
   * 根据ID获取消息详情
   */
  @Get(":id")
  @ApiOperation({ summary: "根据ID获取消息详情" })
  @ApiParam({ name: "id", description: "消息ID", type: Number })
  @ApiResponse({ status: 200, description: "获取成功", type: ResultData })
  async findOne(@Param("id") id: string): Promise<ResultData> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return ResultData.fail(400, "ID参数必须是有效的数字");
    }
    return this.messageService.findOne(numericId);
  }

  /**
   * 更新消息
   */
  @Put()
  @ApiOperation({ summary: "更新消息" })
  @ApiBody({ type: UpdateUserMessageDto })
  @ApiResponse({ status: 200, description: "更新成功", type: ResultData })
  async update(@Body() updateDto: UpdateUserMessageDto): Promise<ResultData> {
    return this.messageService.update(updateDto);
  }

  /**
   * 删除消息
   */
  @Delete(":id")
  @ApiOperation({ summary: "删除消息" })
  @ApiParam({ name: "id", description: "消息ID", type: Number })
  @ApiResponse({ status: 200, description: "删除成功", type: ResultData })
  async remove(@Param("id") id: string): Promise<ResultData> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return ResultData.fail(400, "ID参数必须是有效的数字");
    }
    return this.messageService.remove(numericId);
  }

  /**
   * 标记消息为已读
   */
  @Put(":id/read")
  @ApiOperation({ summary: "标记消息为已读" })
  @ApiParam({ name: "id", description: "消息ID", type: Number })
  @ApiResponse({ status: 200, description: "标记成功", type: ResultData })
  async markAsRead(@Param("id") id: string): Promise<ResultData> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return ResultData.fail(400, "ID参数必须是有效的数字");
    }
    return this.messageService.markAsRead(numericId);
  }

  /**
   * 获取未读消息数量
   */
  @Get("count/unread")
  @ApiOperation({ summary: "获取未读消息数量" })
  @ApiResponse({ status: 200, description: "获取成功", type: ResultData })
  async getUnreadCount(): Promise<ResultData> {
    return this.messageService.getUnreadCount();
  }
}

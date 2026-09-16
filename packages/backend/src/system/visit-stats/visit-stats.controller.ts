import { Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { VisitStatsService } from "./visit-stats.service";
import { ResultData } from "../../common/utils/result";
import { AllowAnon } from "../../common/decorators/allow-anon.decorator";

@ApiTags("网站访问量统计")
@Controller("visit-stats")
export class VisitStatsController {
  constructor(private readonly visitStatsService: VisitStatsService) {}

  @Post("increment")
  @AllowAnon()
  @ApiOperation({ summary: "增加访问量" })
  async incrementVisit(): Promise<ResultData> {
    return this.visitStatsService.incrementVisit();
  }

  @Get("today")
  @ApiOperation({ summary: "获取当天访问量" })
  async getTodayStats(): Promise<ResultData> {
    return this.visitStatsService.getTodayStats();
  }

  @Get("total")
  @ApiOperation({ summary: "获取总访问量" })
  async getTotalVisits(): Promise<ResultData> {
    return this.visitStatsService.getTotalVisits();
  }

  @Get("trend")
  @ApiOperation({ summary: "获取访问趋势数据（折线图）" })
  @ApiQuery({
    name: "period",
    required: false,
    enum: ["week", "month", "nine"],
    description: "时间段：week-7天，month-30天，nine-90天",
  })
  async getVisitTrend(@Query("period") period = "week"): Promise<ResultData> {
    return this.visitStatsService.getVisitTrend(period);
  }
}

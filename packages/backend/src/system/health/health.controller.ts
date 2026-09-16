import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { AllowAnon } from "../../common/decorators/allow-anon.decorator";

@ApiTags("健康检查")
@Controller("health")
export class HealthController {
  private readonly startedAt = Date.now();

  /**
   * 简单健康检查接口, 供 Docker / CI 部署探活使用
   * GET /api/health
   */
  @Get()
  @AllowAnon()
  @ApiOperation({ summary: "服务健康检查" })
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }
}

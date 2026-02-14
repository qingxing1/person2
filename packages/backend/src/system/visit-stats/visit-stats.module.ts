import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VisitStats } from './visit-stats.entity'
import { VisitStatsService } from './visit-stats.service'
import { VisitStatsController } from './visit-stats.controller'

@Module({
  imports: [TypeOrmModule.forFeature([VisitStats])],
  controllers: [VisitStatsController],
  providers: [VisitStatsService],
  exports: [VisitStatsService]
})
export class VisitStatsModule {}
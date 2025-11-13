import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgorithmProblemEntity } from './algorithm-problem.entity';
import { AlgorithmProblemConfigEntity } from './algorithm-problem-config.entity';
import { AlgorithmProblemService } from './algorithm-problem.service';
import { AlgorithmProblemController } from './algorithm-problem.controller';
import { AlgorithmProblemConfigService } from './algorithm-problem-config.service';
import { AlgorithmProblemConfigController } from './algorithm-problem-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlgorithmProblemEntity, AlgorithmProblemConfigEntity])],
  controllers: [AlgorithmProblemController, AlgorithmProblemConfigController],
  providers: [AlgorithmProblemService, AlgorithmProblemConfigService],
  exports: [AlgorithmProblemService],
})
export class AlgorithmProblemModule {}
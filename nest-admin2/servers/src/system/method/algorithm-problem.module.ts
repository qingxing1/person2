import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgorithmProblemEntity } from './algorithm-problem.entity';
import { AlgorithmProblemService } from './algorithm-problem.service';
import { AlgorithmProblemController } from './algorithm-problem.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlgorithmProblemEntity])],
  controllers: [AlgorithmProblemController],
  providers: [AlgorithmProblemService],
  exports: [AlgorithmProblemService],
})
export class AlgorithmProblemModule {}
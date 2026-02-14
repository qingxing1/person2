import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';
import { BlogConfigEntity } from './blog-config.entity';
import { BlogConfigController } from './blog-config.controller';
import { BlogConfigService } from './blog-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, BlogConfigEntity])
  ],
  controllers: [BlogController, BlogConfigController],
  providers: [BlogService, BlogConfigService],
  exports: [BlogService]
})
export class BlogModule {}
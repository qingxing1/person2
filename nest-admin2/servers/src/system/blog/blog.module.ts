import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    MulterModule.register({
      storage: null, // 使用内存存储，确保 file.buffer 可用
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 限制
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new Error('只允许上传图片文件'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule {}
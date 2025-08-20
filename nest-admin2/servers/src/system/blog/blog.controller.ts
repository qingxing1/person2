import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Delete, 
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { ApiResult } from '../../common/decorators/api-result.decorator';
import { ResultData } from '../../common/utils/result';

import { BlogEntity } from './blog.entity';
import { BlogService } from './blog.service';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('博客模块')
@ApiBearerAuth()
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: '创建博客' })
  @ApiResult(BlogEntity)
  async create(@Body() dto: CreateBlogDto): Promise<ResultData> {
    return this.blogService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: '更新博客' })
  @ApiResult()
  async update(@Body() dto: UpdateBlogDto): Promise<ResultData> {
    return this.blogService.update(dto);
  }

  @Get('list')
  @ApiOperation({ summary: '查询博客列表' })
  @ApiQuery({ name: 'title', required: false, description: '博客标题(模糊查询)' })
  @ApiQuery({ name: 'category', required: false, description: '博客分类' })
  @ApiQuery({ name: 'status', required: false, description: '博客状态', enum: ['draft', 'published'] })
  @ApiResult(BlogEntity, true)
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
    @Query('status') status?: string
  ): Promise<ResultData> {
    return this.blogService.findAll({ title, category, status });
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个博客' })
  @ApiResult(BlogEntity)
  async findOne(@Param('id') id: string): Promise<ResultData> {
    return this.blogService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除博客' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.blogService.delete(id);
  }

  @Post('upload/cover')
  @ApiOperation({ summary: '上传博客封面图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '封面图片文件'
        }
      }
    }
  })
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResult(String)
  async uploadCoverImage(@UploadedFile() file: Express.Multer.File): Promise<ResultData> {
    return this.blogService.uploadImage(file, 'cover');
  }

  @Post('upload/images')
  @ApiOperation({ summary: '上传博客内容图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: '博客内容图片文件列表'
        }
      }
    }
  })
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiResult(String, true)
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<ResultData> {
    return this.blogService.uploadImages(files, 'content');
  }
}
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, Like } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { BlogEntity } from "./blog.entity";
import { CreateBlogDto } from './dto/create-blog.dto';
import { ResultData } from '../../common/utils/result';
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from '../../common/enums/code.enum';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
    @InjectEntityManager()
    private readonly blogManager: EntityManager,
    private readonly config: ConfigService
  ) {}

  /** 格式化日期时间为字符串 */
  private formatDateTime(date: Date): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /** 创建博客 */
  async create(dto: CreateBlogDto): Promise<ResultData> {
    const blog = plainToInstance(BlogEntity, dto);
    const res = await this.blogManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<BlogEntity>(blog);
    });
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试');
    
    // 格式化时间
    const formattedBlog = {
      ...res,
      createTime: this.formatDateTime(res.createTime),
      updateTime: this.formatDateTime(res.updateTime)
    };
    
    return ResultData.ok(formattedBlog);
  }

  /** 更新博客 */
  async update(dto: UpdateBlogDto): Promise<ResultData> {
    const existing = await this.blogRepo.findOne({ where: { id: dto.id } });
    if (!existing) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '博客不存在或已被删除');
    
    const { affected } = await this.blogManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<BlogEntity>(BlogEntity, dto.id, dto);
    });
    
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试');
    return ResultData.ok();
  }

  /** 删除博客 */
  async delete(id: string): Promise<ResultData> {
    const existing = await this.blogRepo.findOne({ where: { id } });
    if (!existing) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '博客不存在或已被删除');
    
    const { affected } = await this.blogManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.delete<BlogEntity>(BlogEntity, id);
    });
    
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除博客失败，请稍后尝试');
    return ResultData.ok();
  }

  /** 查询所有博客 */
  async findAll(query?: { title?: string, category?: string, status?: string, page?: number, size?: number }): Promise<ResultData> {
    const where: any = {};
    
    if (query?.title) {
      where.title = Like(`%${query.title}%`);
    }
    
    if (query?.category) {
      where.category = query.category;
    }
    
    if (query?.status) {
      where.status = query.status;
    }
    
    const page = query?.page || 1;
    const size = query?.size || 10;
    const skip = (page - 1) * size;
    
    const [blogs, total] = await this.blogRepo.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip,
      take: size
    });
    
    // 格式化时间
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      createTime: this.formatDateTime(blog.createTime),
      updateTime: this.formatDateTime(blog.updateTime)
    }));
    
    return ResultData.ok({
      list: formattedBlogs,
      total,
      page,
      size
    });
  }

  /** 查询单个博客 */
  async findOne(id: string): Promise<ResultData> {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '博客不存在或已被删除');
    
    // 增加浏览次数
    blog.viewCount += 1;
    await this.blogRepo.update(id, { viewCount: blog.viewCount });
    
    // 格式化时间
    const formattedBlog = {
      ...blog,
      createTime: this.formatDateTime(blog.createTime),
      updateTime: this.formatDateTime(blog.updateTime)
    };
    
    return ResultData.ok(formattedBlog);
  }

  /** 上传博客图片 */
  async uploadImage(file: Express.Multer.File, type: string): Promise<ResultData> {
    if (!file) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, '请选择要上传的图片');
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, '只允许上传图片文件');
    }

    // 检查文件大小 (最大5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, '图片大小不能超过5MB');
    }

    // 使用现有的OSS服务上传图片
    try {
      const result = await this.uploadToLocal(file, type);
      return ResultData.ok(result);
    } catch (error) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, `文件上传失败: ${error.message}`);
    }
  }

  /** 本地文件上传 */
  private async uploadToLocal(file: Express.Multer.File, type: string): Promise<string> {
    console.log('上传文件信息:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
      hasPath: !!file.path
    });

    // 获取上传目录配置
    const uploadDir = this.config.get<string>('app.file.location') || '../upload';
    const basePath = path.isAbsolute(uploadDir) 
      ? uploadDir 
      : path.join(process.cwd(), uploadDir);
    
    // 确保目录存在
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }
    
    // 创建子目录
    const subDir = type === 'cover' ? 'blog/cover' : 'blog/content';
    const targetDir = path.join(basePath, subDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 生成文件名
    const ext = path.extname(file.originalname) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;
    const filePath = path.join(targetDir, fileName);
    
    // 处理文件数据 - 支持 buffer 和 path 两种方式
    let fileData: Buffer;
    if (file.buffer) {
      fileData = file.buffer;
    } else if (file.path) {
      // 如果 Multer 使用了磁盘存储，从文件路径读取
      fileData = fs.readFileSync(file.path);
    } else {
      throw new Error('无法获取文件数据');
    }
    
    // 写入文件
    fs.writeFileSync(filePath, fileData);
    
    // 返回访问URL
    const domain = this.config.get<string>('app.file.domain') || 'http://localhost:6999';
    const serveRoot = this.config.get<string>('app.file.serveRoot') || '/static';
    
    return `${domain}${serveRoot}/${subDir}/${fileName}`;
  }

  /** 上传多张博客图片 */
  async uploadImages(files: Express.Multer.File[], type: string): Promise<ResultData> {
    if (!files || files.length === 0) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, '请选择要上传的图片');
    }

    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const result = await this.uploadImage(file, type);
      if (result.code === 200) {
        uploadedUrls.push(result.data);
      }
    }

    return ResultData.ok(uploadedUrls);
  }
}
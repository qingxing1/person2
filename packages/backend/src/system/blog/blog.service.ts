import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, Like } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { BlogEntity } from "./blog.entity";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { ResultData } from "../../common/utils/result";
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from "../../common/enums/code.enum";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { ConfigService } from "@nestjs/config";
import * as yaml from "js-yaml";

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
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /** 创建博客 */
  async create(dto: CreateBlogDto): Promise<ResultData> {
    const blog = plainToInstance(BlogEntity, dto);
    const res = await this.blogManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<BlogEntity>(blog);
      }
    );
    if (!res)
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, "创建失败，请稍后重试");

    // 格式化时间
    const formattedBlog = {
      ...res,
      createTime: this.formatDateTime(res.createTime),
      updateTime: this.formatDateTime(res.updateTime),
    };

    return ResultData.ok(formattedBlog);
  }

  /** 更新博客 */
  async update(dto: UpdateBlogDto): Promise<ResultData> {
    const existing = await this.blogRepo.findOne({ where: { id: dto.id } });
    if (!existing)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "博客不存在或已被删除");

    const { affected } = await this.blogManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.update<BlogEntity>(
          BlogEntity,
          dto.id,
          dto
        );
      }
    );

    if (!affected)
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, "更新失败，请稍后尝试");
    return ResultData.ok();
  }

  /** 删除博客 */
  async delete(id: string): Promise<ResultData> {
    const existing = await this.blogRepo.findOne({ where: { id } });
    if (!existing)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "博客不存在或已被删除");

    const { affected } = await this.blogManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.delete<BlogEntity>(
          BlogEntity,
          id
        );
      }
    );

    if (!affected)
      return ResultData.fail(
        AppHttpCode.SERVICE_ERROR,
        "删除博客失败，请稍后尝试"
      );
    return ResultData.ok();
  }

  /** 查询所有博客 */
  async findAll(query?: {
    title?: string;
    category?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<ResultData> {
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
      order: { createTime: "DESC" },
      skip,
      take: size,
    });

    // 格式化时间
    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      createTime: this.formatDateTime(blog.createTime),
      updateTime: this.formatDateTime(blog.updateTime),
    }));

    return ResultData.ok({
      list: formattedBlogs,
      total,
      page,
      size,
    });
  }

  /** 查询单个博客 */
  async findOne(id: string): Promise<ResultData> {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog)
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, "博客不存在或已被删除");

    // 增加浏览次数
    blog.viewCount += 1;
    await this.blogRepo.update(id, { viewCount: blog.viewCount });

    // 格式化时间
    const formattedBlog = {
      ...blog,
      createTime: this.formatDateTime(blog.createTime),
      updateTime: this.formatDateTime(blog.updateTime),
    };

    return ResultData.ok(formattedBlog);
  }

  /** 上传博客图片 */
  async uploadImage(
    file: Express.Multer.File,
    type: string
  ): Promise<ResultData> {
    if (!file) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, "请选择要上传的图片");
    }

    // 检查文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, "只允许上传图片文件");
    }

    // 检查文件大小 (最大5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, "图片大小不能超过5MB");
    }

    // 使用现有的OSS服务上传图片
    try {
      const result = await this.uploadToLocal(file, type);
      return ResultData.ok(result);
    } catch (error) {
      return ResultData.fail(
        AppHttpCode.SERVICE_ERROR,
        `文件上传失败: ${error.message}`
      );
    }
  }

  /** 本地文件上传 */
  private async uploadToLocal(
    file: Express.Multer.File,
    type: string
  ): Promise<string> {
    console.log("上传文件信息:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hasBuffer: !!file.buffer,
      hasPath: !!file.path,
    });

    // 获取上传目录配置
    const uploadDir =
      this.config.get<string>("app.file.location") || "../upload";
    const basePath = path.isAbsolute(uploadDir)
      ? uploadDir
      : path.join(process.cwd(), uploadDir);

    // 确保目录存在
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    // 创建子目录
    const subDir = type === "cover" ? "blog/cover" : "blog/content";
    const targetDir = path.join(basePath, subDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 生成文件名
    const ext = path.extname(file.originalname) || ".jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}${ext}`;
    const filePath = path.join(targetDir, fileName);

    // 处理文件数据 - 支持 buffer 和 path 两种方式
    let fileData: Buffer;
    if (file.buffer) {
      fileData = file.buffer;
    } else if (file.path) {
      // 如果 Multer 使用了磁盘存储，从文件路径读取
      fileData = fs.readFileSync(file.path);
    } else {
      throw new Error("无法获取文件数据");
    }

    // 写入文件
    fs.writeFileSync(filePath, fileData);

    // 返回访问URL
    const domain =
      this.config.get<string>("app.file.domain") || "http://localhost:6999";
    const serveRoot =
      this.config.get<string>("app.file.serveRoot") || "/static";

    return `${domain}${serveRoot}/${subDir}/${fileName}`;
  }

  /** 上传多张博客图片 */
  async uploadImages(
    files: Express.Multer.File[],
    type: string
  ): Promise<ResultData> {
    if (!files || files.length === 0) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, "请选择要上传的图片");
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

  /** 上传Markdown文件并解析内容 */
  async uploadMarkdown(file: Express.Multer.File): Promise<ResultData> {
    if (!file) {
      return ResultData.fail(
        AppHttpCode.PARAM_INVALID,
        "请选择要上传的Markdown文件"
      );
    }

    // 检查文件类型
    const allowedTypes = [
      "text/plain",
      "text/markdown",
      "application/octet-stream",
    ]; // application/octet-stream 是某些系统对 .md 文件的识别
    const allowedExtensions = [".md", ".markdown"];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (
      !allowedTypes.includes(file.mimetype) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      console.log("文件类型:", file.mimetype);
      return ResultData.fail(
        AppHttpCode.PARAM_INVALID,
        "只允许上传Markdown文件(.md, .markdown)"
      );
    }

    // 检查文件大小 (最大50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return ResultData.fail(AppHttpCode.PARAM_INVALID, "文件大小不能超过50MB");
    }

    try {
      // 读取文件内容
      let content: string;
      if (file.buffer) {
        content = file.buffer.toString("utf8");
      } else if (file.path) {
        content = fs.readFileSync(file.path, "utf8");
      } else {
        return ResultData.fail(AppHttpCode.SERVICE_ERROR, "无法读取文件内容");
      }

      // 从Markdown内容中提取标题
      // 尝试匹配 # 标题格式
      const titleMatch = content.match(/^#\s+(.+)$/m);
      let title = "";
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        // 如果没有找到标题，则使用文件名（去掉扩展名）
        title = path.basename(file.originalname, fileExtension);
      }

      // 返回解析后的Markdown内容和标题，让前端决定是否创建博客
      return ResultData.ok({
        content: content,
        title: title,
        fileName: file.originalname,
        message: "Markdown文件上传并解析成功",
      });
    } catch (error) {
      console.error("上传Markdown文件时出错:", error);
      return ResultData.fail(
        AppHttpCode.SERVICE_ERROR,
        `文件处理失败: ${error.message}`
      );
    }
  }

  /** 批量上传Markdown文件夹并解析内容 */
  async batchUploadMarkdown(files: Express.Multer.File[]): Promise<ResultData> {
    if (!files || files.length === 0) {
      return ResultData.fail(
        AppHttpCode.PARAM_INVALID,
        "请至少选择一个Markdown文件"
      );
    }

    const results: any[] = [];
    const failedFiles: string[] = [];

    for (const file of files) {
      try {
        // 检查文件类型
        const allowedTypes = [
          "text/plain",
          "text/markdown",
          "application/octet-stream",
        ];
        const allowedExtensions = [".md", ".markdown"];

        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (
          !allowedTypes.includes(file.mimetype) &&
          !allowedExtensions.includes(fileExtension)
        ) {
          failedFiles.push(`${file.originalname} - 不是有效的Markdown文件`);
          continue;
        }

        // 检查文件大小 (最大50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          failedFiles.push(`${file.originalname} - 文件大小超过50MB限制`);
          continue;
        }

        // 读取文件内容
        let content: string;
        if (file.buffer) {
          content = file.buffer.toString("utf8");
        } else if (file.path) {
          content = fs.readFileSync(file.path, "utf8");
        } else {
          failedFiles.push(`${file.originalname} - 无法读取文件内容`);
          continue;
        }

        // 从Markdown内容中提取标题
        const titleMatch = content.match(/^#\s+(.+)$/m);
        let title = "";
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          // 如果没有找到标题，则使用文件名（去掉扩展名）
          title = path.basename(file.originalname, fileExtension);
        }

        // 解析frontmatter（如果有）
        let parsedContent = content;
        let metadata: any = {};

        // 尝试解析YAML frontmatter
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n?---\s*\n/;
        const frontmatterMatch = content.match(frontmatterRegex);

        if (frontmatterMatch) {
          try {
            metadata = yaml.load(frontmatterMatch[1]) || {};
            parsedContent = content.slice(frontmatterMatch[0].length);
          } catch (e) {
            console.warn("解析YAML frontmatter失败:", e);
          }
        }

        // 从文件路径中提取可能的分类信息（如果文件在特定目录中）
        let category = metadata.category || "未分类";
        if (!metadata.category && file.fieldname) {
          // 如果文件是通过文件夹上传的，field可能包含路径信息
          const pathParts = file.fieldname.split("/");
          if (pathParts.length > 1) {
            // 使用第一个路径部分作为分类（如果它不是根目录）
            const potentialCategory = pathParts[0];
            if (potentialCategory && potentialCategory !== "files") {
              category = potentialCategory;
            }
          }
        }

        // 从fieldname中提取更准确的路径信息
        let filePath = file.originalname; // 默认使用原始文件名
        if (file.fieldname && file.fieldname.startsWith("files[")) {
          // 如果是通过文件夹上传，尝试提取路径信息
          // Multer通常会将文件字段命名为 'files[originalName]' 或类似格式
          const match = file.fieldname.match(/files\[([^\]]+)\]/);
          if (match && match[1]) {
            filePath = match[1]; // 使用原始路径名
          }
        }

        // 创建博客实体并保存到数据库
        const blogEntity = new BlogEntity();
        blogEntity.title = title;
        blogEntity.content = parsedContent;
        blogEntity.category = category;
        blogEntity.tags = Array.isArray(metadata.tags)
          ? metadata.tags.join(",")
          : metadata.tags || "默认";
        blogEntity.author = metadata.author || "admin";
        blogEntity.status = metadata.status || "draft";
        blogEntity.createTime = new Date();
        blogEntity.updateTime = new Date();
        blogEntity.viewCount = 0;

        // 保存到数据库
        const savedBlog = await this.blogManager.save(BlogEntity, blogEntity);

        results.push({
          id: savedBlog.id, // 添加数据库ID
          filename: file.originalname,
          filepath: filePath, // 保留更准确的路径信息
          title: title,
          content: parsedContent,
          metadata: metadata, // 包含从frontmatter解析出的元数据
          status: "draft", // 默认为草稿状态
          category: category, // 使用frontmatter中的分类或从路径推断的分类
          tags: metadata.tags || ["默认"], // 使用frontmatter中的标签，否则使用默认值
          author: metadata.author || "admin", // 使用frontmatter中的作者，否则使用默认值
          success: true,
        });
      } catch (error) {
        console.error(`处理文件 ${file.originalname} 时出错:`, error);
        failedFiles.push(`${file.originalname} - ${error.message}`);
      }
    }

    const successCount = results.length;
    const totalCount = files.length;
    const failureCount = failedFiles.length;

    return ResultData.ok({
      results: results,
      failedFiles: failedFiles,
      summary: {
        total: totalCount,
        success: successCount,
        failed: failureCount,
        message: `批量上传完成，成功处理 ${successCount} 个文件，失败 ${failureCount} 个文件`,
      },
    });
  }
}

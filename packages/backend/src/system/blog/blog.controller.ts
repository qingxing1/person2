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
  HttpCode,
  StreamableFile,
} from "@nestjs/common";
import { Express } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import {
  FileInterceptor,
  FilesInterceptor,
  AnyFilesInterceptor,
} from "@nestjs/platform-express";
import * as path from "path";

import { ApiResult } from "../../common/decorators/api-result.decorator";
import { ResultData } from "../../common/utils/result";
import { AllowAnon } from "../../common/decorators/allow-anon.decorator";

import { BlogEntity } from "./blog.entity";
import { BlogService } from "./blog.service";

import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@ApiTags("博客模块")
@ApiBearerAuth()
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: "创建博客" })
  @ApiResult(BlogEntity)
  async create(@Body() dto: CreateBlogDto): Promise<ResultData> {
    return this.blogService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: "更新博客" })
  @ApiResult()
  async update(@Body() dto: UpdateBlogDto): Promise<ResultData> {
    return this.blogService.update(dto);
  }

  @Get("list")
  @AllowAnon()
  @ApiOperation({ summary: "查询博客列表" })
  @ApiQuery({
    name: "title",
    required: false,
    description: "博客标题(模糊查询)",
  })
  @ApiQuery({ name: "category", required: false, description: "博客分类" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "博客状态",
    enum: ["draft", "published"],
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "页码",
    type: Number,
  })
  @ApiQuery({
    name: "size",
    required: false,
    description: "每页数量",
    type: Number,
  })
  @ApiResult(BlogEntity, true)
  async findAll(
    @Query("title") title?: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("size") size?: number
  ): Promise<ResultData> {
    return this.blogService.findAll({
      title,
      category,
      status,
      page: page || 1,
      size: size || 10,
    });
  }

  @Get(":id")
  @AllowAnon()
  @ApiOperation({ summary: "查询单个博客" })
  @ApiResult(BlogEntity)
  async findOne(@Param("id") id: string): Promise<ResultData> {
    return this.blogService.findOne(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除博客" })
  @ApiResult()
  async delete(@Param("id") id: string): Promise<ResultData> {
    return this.blogService.delete(id);
  }

  @Post("upload/cover")
  @ApiOperation({ summary: "上传博客封面图片" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "封面图片文件",
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          return callback(new Error("只允许上传图片文件"), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiResult(String)
  async uploadCoverImage(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResultData> {
    return this.blogService.uploadImage(file, "cover");
  }

  @Post("upload/images")
  @ApiOperation({ summary: "上传博客内容图片" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "博客内容图片文件列表",
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          return callback(new Error("只允许上传图片文件"), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiResult(String, true)
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ResultData> {
    return this.blogService.uploadImages(files, "content");
  }

  @Post("upload/markdown")
  @ApiOperation({ summary: "上传Markdown文件并创建博客" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Markdown文件",
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          "text/plain",
          "text/markdown",
          "text/x-markdown",
          "application/octet-stream",
        ];
        const allowedExtensions = [".md", ".markdown"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (
          !allowedTypes.includes(file.mimetype) &&
          !allowedExtensions.includes(fileExtension)
        ) {
          return callback(new Error("只允许上传Markdown文件"), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for markdown files
    })
  )
  @ApiResult()
  async uploadMarkdown(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResultData> {
    return this.blogService.uploadMarkdown(file);
  }

  @Post("batch-upload/markdown")
  @ApiOperation({ summary: "批量上传Markdown文件" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Markdown文件列表",
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(
    AnyFilesInterceptor({
      // 使用AnyFilesInterceptor接受任何字段名的文件
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          "text/plain",
          "text/markdown",
          "text/x-markdown",
          "application/octet-stream",
        ];
        const allowedExtensions = [".md", ".markdown"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (
          !allowedTypes.includes(file.mimetype) &&
          !allowedExtensions.includes(fileExtension)
        ) {
          return callback(new Error("只允许上传Markdown文件"), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file limit
        files: 50,
      }, // 最多同时上传50个文件
    })
  )
  @ApiResult()
  async batchUploadMarkdown(
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<ResultData> {
    return this.blogService.batchUploadMarkdown(files);
  }
}

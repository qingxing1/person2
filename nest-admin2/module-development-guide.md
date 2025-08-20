# NestJS 模块开发完整指南

基于博客模块的最佳实践，教你如何独立开发一个完整的 CRUD 模块

## 📋 开发前准备

### 1. 理解项目结构
```
src/system/[模块名]/
├── [模块名].entity.ts      # 实体类 - 定义数据库表结构
├── [模块名].controller.ts  # 控制器 - 定义API接口
├── [模块名].service.ts     # 服务类 - 业务逻辑实现
├── [模块名].module.ts      # 模块配置 - 依赖注入配置
└── dto/                    # 数据传输对象
    ├── create-[模块名].dto.ts   # 创建DTO
    └── update-[模块名].dto.ts   # 更新DTO
```

### 2. 技术栈回顾
- **框架**: NestJS 10.x
- **ORM**: TypeORM
- **数据库**: MySQL 5.7+
- **文档**: Swagger/OpenAPI
- **验证**: class-validator + class-transformer

## 🚀 完整开发步骤

### 第一步：设计数据库表结构（实体类）

#### 1.1 创建实体文件 `[模块名].entity.ts`

以`ProductEntity`为例：

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Entity 
} from 'typeorm'

@Entity('products') // 对应数据库表名
export class ProductEntity {
  @ApiProperty({ description: '商品ID' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @ApiProperty({ description: '商品名称' })
  @Column({ 
    type: 'varchar', 
    length: 100, 
    comment: '商品名称' 
  })
  name: string

  @ApiProperty({ description: '商品价格' })
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    comment: '商品价格' 
  })
  price: number

  @ApiProperty({ description: '商品状态' })
  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive'], 
    default: 'active', 
    comment: '商品状态' 
  })
  status: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ 
    type: 'datetime', 
    name: 'create_time', 
    comment: '创建时间' 
  })
  createTime: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ 
    type: 'datetime', 
    name: 'update_time', 
    comment: '更新时间' 
  })
  updateTime: Date
}
```

#### 1.2 常用装饰器说明

| 装饰器 | 作用 | 示例 |
|--------|------|------|
| `@Entity()` | 标记为数据库实体 | `@Entity('users')` |
| `@PrimaryGeneratedColumn()` | 主键自增 | `@PrimaryGeneratedColumn({ type: 'bigint' })` |
| `@Column()` | 普通字段 | `@Column({ type: 'varchar', length: 100 })` |
| `@CreateDateColumn()` | 创建时间 | 自动填充 |
| `@UpdateDateColumn()` | 更新时间 | 自动更新 |
| `@ApiProperty()` | Swagger文档 | `@ApiProperty({ description: '用户名' })` |

### 第二步：创建DTO（数据传输对象）

#### 2.1 创建DTO `dto/create-product.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsNumber,
  Min,
  MaxLength,
  IsDecimal 
} from 'class-validator'

export class CreateProductDto {
  @ApiProperty({ description: '商品名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '商品名称不能为空' })
  @MaxLength(100, { message: '商品名称最多100个字符' })
  readonly name: string

  @ApiProperty({ description: '商品价格' })
  @IsNumber({}, { message: 'price 类型错误, 正确类型 number' })
  @Min(0, { message: '价格不能小于0' })
  readonly price: number

  @ApiProperty({ 
    description: '商品状态', 
    enum: ['active', 'inactive'], 
    required: false 
  })
  @IsEnum(['active', 'inactive'], { message: '状态只能是 active 或 inactive' })
  @IsOptional()
  readonly status?: string
}
```

#### 2.2 更新DTO `dto/update-product.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  Min, 
  MaxLength,
  IsNumberString 
} from 'class-validator'

export class UpdateProductDto {
  @ApiProperty({ description: '商品ID' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  id: string

  @ApiProperty({ description: '商品名称', required: false })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(100, { message: '商品名称最多100个字符' })
  readonly name?: string

  @ApiProperty({ description: '商品价格', required: false })
  @IsNumber({}, { message: 'price 类型错误, 正确类型 number' })
  @Min(0, { message: '价格不能小于0' })
  @IsOptional()
  readonly price?: number
}
```

#### 2.3 常用验证装饰器

| 装饰器 | 作用 | 示例 |
|--------|------|------|
| `@IsString()` | 字符串验证 | `@IsString({ message: '必须是字符串' })` |
| `@IsNotEmpty()` | 非空验证 | `@IsNotEmpty({ message: '不能为空' })` |
| `@IsOptional()` | 可选字段 | `@IsOptional()` |
| `@IsEnum()` | 枚举验证 | `@IsEnum(['active', 'inactive'])` |
| `@IsNumber()` | 数字验证 | `@IsNumber({}, { message: '必须是数字' })` |
| `@Min()` / `@Max()` | 数值范围 | `@Min(0)` `@Max(100)` |
| `@MaxLength()` | 最大长度 | `@MaxLength(255)` |

### 第三步：创建服务类（业务逻辑）

#### 3.1 服务类 `product.service.ts`

```typescript
import { Injectable } from '@nestjs/common'
import { 
  InjectEntityManager, 
  InjectRepository 
} from '@nestjs/typeorm'
import { 
  EntityManager, 
  Repository, 
  Like 
} from 'typeorm'
import { ProductEntity } from './product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ResultData } from '../../common/utils/result'
import { plainToInstance } from 'class-transformer'
import { AppHttpCode } from '../../common/enums/code.enum'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectEntityManager()
    private readonly productManager: EntityManager
  ) {}

  /** 创建商品 */
  async create(dto: CreateProductDto): Promise<ResultData> {
    // 1. 将DTO转换为实体类
    const product = plainToInstance(ProductEntity, dto)
    
    // 2. 使用事务保存数据
    const res = await this.productManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<ProductEntity>(product)
    })
    
    // 3. 返回结果
    if (!res) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    }
    return ResultData.ok(res)
  }

  /** 更新商品 */
  async update(dto: UpdateProductDto): Promise<ResultData> {
    // 1. 检查数据是否存在
    const existing = await this.productRepo.findOne({ 
      where: { id: dto.id } 
    })
    if (!existing) {
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '商品不存在或已被删除')
    }
    
    // 2. 使用事务更新数据
    const { affected } = await this.productManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<ProductEntity>(
        ProductEntity, 
        dto.id, 
        dto
      )
    })
    
    // 3. 返回结果
    if (!affected) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试')
    }
    return ResultData.ok()
  }

  /** 删除商品 */
  async delete(id: string): Promise<ResultData> {
    // 1. 检查数据是否存在
    const existing = await this.productRepo.findOne({ where: { id } })
    if (!existing) {
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '商品不存在或已被删除')
    }
    
    // 2. 使用事务删除数据
    const { affected } = await this.productManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.delete<ProductEntity>(ProductEntity, id)
    })
    
    // 3. 返回结果
    if (!affected) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除商品失败，请稍后尝试')
    }
    return ResultData.ok()
  }

  /** 查询所有商品 */
  async findAll(query?: { name?: string, status?: string }): Promise<ResultData> {
    // 1. 构建查询条件
    const where: any = {}
    
    if (query?.name) {
      where.name = Like(`%${query.name}%`) // 模糊查询
    }
    
    if (query?.status) {
      where.status = query.status
    }
    
    // 2. 执行查询
    const products = await this.productRepo.find({
      where,
      order: { createTime: 'DESC' } // 按创建时间倒序
    })
    
    return ResultData.ok(products)
  }

  /** 查询单个商品 */
  async findOne(id: string): Promise<ResultData> {
    const product = await this.productRepo.findOne({ where: { id } })
    if (!product) {
      return ResultData.fail(AppHttpCode.DATA_IS_EMPTY, '商品不存在或已被删除')
    }
    return ResultData.ok(product)
  }
}
```

#### 3.2 常用TypeORM操作

| 操作 | 语法 | 示例 |
|------|------|------|
| 查询所有 | `find()` | `repo.find({ where, order })` |
| 查询单个 | `findOne()` | `repo.findOne({ where: { id } })` |
| 模糊查询 | `Like()` | `where.name = Like(\`%${name}%\`)` |
| 保存数据 | `save()` | `transactionalEntityManager.save(entity)` |
| 更新数据 | `update()` | `transactionalEntityManager.update(Entity, id, data)` |
| 删除数据 | `delete()` | `transactionalEntityManager.delete(Entity, id)` |

### 第四步：创建控制器（API接口）

#### 4.1 控制器 `product.controller.ts`

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ApiResult } from '../../common/decorators/api-result.decorator'
import { ResultData } from '../../common/utils/result'
import { ProductEntity } from './product.entity'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@ApiTags('商品管理')
@ApiBearerAuth() // JWT认证
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: '创建商品' })
  @ApiResult(ProductEntity)
  async create(@Body() dto: CreateProductDto): Promise<ResultData> {
    return this.productService.create(dto)
  }

  @Put()
  @ApiOperation({ summary: '更新商品' })
  @ApiResult()
  async update(@Body() dto: UpdateProductDto): Promise<ResultData> {
    return this.productService.update(dto)
  }

  @Get('list')
  @ApiOperation({ summary: '查询商品列表' })
  @ApiQuery({ name: 'name', required: false, description: '商品名称(模糊查询)' })
  @ApiQuery({ name: 'status', required: false, description: '商品状态' })
  @ApiResult(ProductEntity, true)
  async findAll(
    @Query('name') name?: string,
    @Query('status') status?: string
  ): Promise<ResultData> {
    return this.productService.findAll({ name, status })
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单个商品' })
  @ApiResult(ProductEntity)
  async findOne(@Param('id') id: string): Promise<ResultData> {
    return this.productService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商品' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.productService.delete(id)
  }
}
```

#### 4.2 常用控制器装饰器

| 装饰器 | 作用 | 示例 |
|--------|------|------|
| `@Controller()` | 定义控制器 | `@Controller('product')` |
| `@Get()` | GET请求 | `@Get('list')` |
| `@Post()` | POST请求 | `@Post()` |
| `@Put()` | PUT请求 | `@Put()` |
| `@Delete()` | DELETE请求 | `@Delete(':id')` |
| `@Body()` | 获取请求体 | `@Body() dto: CreateDto` |
| `@Param()` | 获取路径参数 | `@Param('id') id: string` |
| `@Query()` | 获取查询参数 | `@Query('name') name: string` |

### 第五步：创建模块配置

#### 5.1 模块配置 `product.module.ts`

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductEntity } from './product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])], // 导入实体
  controllers: [ProductController], // 控制器
  providers: [ProductService], // 服务提供者
  exports: [ProductService] // 导出服务供其他模块使用
})
export class ProductModule {}
```

### 第六步：注册模块

#### 6.1 在根模块注册
编辑 `src/app.module.ts`：

```typescript
import { ProductModule } from './system/product/product.module'

@Module({
  imports: [
    // ... 其他模块
    ProductModule, // 添加你的新模块
  ]
})
export class AppModule {}
```

### 第七步：数据库迁移

#### 7.1 创建数据库表
执行以下SQL创建对应的数据表：

```sql
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT '商品状态',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';
```

## 🔧 高级功能开发

### 1. 分页查询

```typescript
// 在service中添加分页方法
async findPage(page: number, size: number, query?: any): Promise<ResultData> {
  const [list, total] = await this.productRepo.findAndCount({
    where: query,
    order: { createTime: 'DESC' },
    skip: size * (page - 1),
    take: size
  })
  
  return ResultData.ok({
    list,
    total,
    page,
    size
  })
}
```

### 2. 关联查询

```typescript
// 在实体中定义关联
@OneToMany(() => OrderEntity, order => order.product)
orders: OrderEntity[]

// 查询时包含关联
const product = await this.productRepo.findOne({
  where: { id },
  relations: ['orders']
})
```

### 3. 事务处理

```typescript
async createWithDetail(dto: CreateProductDto): Promise<ResultData> {
  return await this.productManager.transaction(async (transactionalEntityManager) => {
    // 1. 创建商品
    const product = await transactionalEntityManager.save(ProductEntity, dto)
    
    // 2. 创建商品详情
    await transactionalEntityManager.save(ProductDetailEntity, {
      productId: product.id,
      ...detailData
    })
    
    return product
  })
}
```

## 📝 开发检查清单

在开发新模块时，请按以下清单检查：

### ✅ 必需文件
- [ ] `[模块名].entity.ts` - 实体类
- [ ] `[模块名].service.ts` - 服务类
- [ ] `[模块名].controller.ts` - 控制器
- [ ] `[模块名].module.ts` - 模块配置
- [ ] `dto/create-[模块名].dto.ts` - 创建DTO
- [ ] `dto/update-[模块名].dto.ts` - 更新DTO

### ✅ 配置检查
- [ ] 在`app.module.ts`中导入新模块
- [ ] 数据库表已创建
- [ ] Swagger文档正常显示
- [ ] API测试通过

### ✅ 功能验证
- [ ] 创建功能正常
- [ ] 更新功能正常
- [ ] 删除功能正常
- [ ] 查询列表正常
- [ ] 查询单个正常

## 🚀 快速开始模板

使用以下模板快速创建新模块：

```bash
# 创建目录结构
mkdir -p src/system/[模块名]/dto

# 复制模板文件（以product为例）
cp src/system/blog/blog.entity.ts src/system/[模块名]/[模块名].entity.ts
cp src/system/blog/blog.service.ts src/system/[模块名]/[模块名].service.ts
cp src/system/blog/blog.controller.ts src/system/[模块名]/[模块名].controller.ts
cp src/system/blog/blog.module.ts src/system/[模块名]/[模块名].module.ts
cp src/system/blog/dto/create-blog.dto.ts src/system/[模块名]/dto/create-[模块名].dto.ts
cp src/system/blog/dto/update-blog.dto.ts src/system/[模块名]/dto/update-[模块名].dto.ts
```

然后使用IDE的全局替换功能，将模板中的`blog`替换为你的模块名即可开始开发！
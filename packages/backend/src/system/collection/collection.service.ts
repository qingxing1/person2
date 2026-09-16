import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { UserCollectionEntity } from "./user-collection.entity";
import { CreateUserCollectionDto } from "./dto/create-user-collection.dto";
import { UpdateUserCollectionDto } from "./dto/update-user-collection.dto";
import { FindCollectionListDto } from "./dto/find-collection-list.dto";
import { ResultData } from "../../common/utils/result";

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(UserCollectionEntity)
    private readonly collectionRepository: Repository<UserCollectionEntity>
  ) {}

  /**
   * 创建收藏
   */
  async create(createDto: CreateUserCollectionDto): Promise<ResultData> {
    try {
      const collection = this.collectionRepository.create(createDto);
      const savedCollection = await this.collectionRepository.save(collection);
      return ResultData.ok(savedCollection);
    } catch (error) {
      return ResultData.fail(500, `创建收藏失败: ${error.message}`);
    }
  }

  /**
   * 获取收藏列表
   */
  async findAll(findDto: FindCollectionListDto): Promise<ResultData> {
    try {
      const { name, url, category, page = 1, size = 10 } = findDto;

      const where: any = {};
      if (name) where.name = Like(`%${name}%`);
      if (url) where.url = Like(`%${url}%`);
      if (category) where.category = Like(`%${category}%`);

      const [data, total] = await this.collectionRepository.findAndCount({
        where,
        order: { createTime: "DESC" },
        skip: (page - 1) * size,
        take: size,
      });

      return ResultData.ok({
        data,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      });
    } catch (error) {
      return ResultData.fail(500, `获取收藏列表失败: ${error.message}`);
    }
  }

  /**
   * 获取收藏详情
   */
  async findOne(id: number): Promise<ResultData> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id },
      });
      if (!collection) {
        return ResultData.fail(404, "收藏信息不存在");
      }
      return ResultData.ok(collection);
    } catch (error) {
      return ResultData.fail(500, `获取收藏详情失败: ${error.message}`);
    }
  }

  /**
   * 更新收藏
   */
  async update(updateDto: UpdateUserCollectionDto): Promise<ResultData> {
    try {
      const { id, ...updateData } = updateDto;

      const collection = await this.collectionRepository.findOne({
        where: { id },
      });
      if (!collection) {
        return ResultData.fail(404, "收藏信息不存在");
      }

      const updatedCollection = await this.collectionRepository.save({
        ...collection,
        ...updateData,
      });

      return ResultData.ok(updatedCollection);
    } catch (error) {
      return ResultData.fail(500, `更新收藏失败: ${error.message}`);
    }
  }

  /**
   * 删除收藏
   */
  async remove(id: number): Promise<ResultData> {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { id },
      });
      if (!collection) {
        return ResultData.fail(404, "收藏信息不存在");
      }

      await this.collectionRepository.remove(collection);
      return ResultData.ok(true);
    } catch (error) {
      return ResultData.fail(500, `删除收藏失败: ${error.message}`);
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<ResultData> {
    try {
      const categories = await this.collectionRepository
        .createQueryBuilder("collection")
        .select("DISTINCT collection.category", "category")
        .orderBy("collection.category", "ASC")
        .getRawMany();

      return ResultData.ok(categories.map((item) => item.category));
    } catch (error) {
      return ResultData.fail(500, `获取分类列表失败: ${error.message}`);
    }
  }

  /**
   * 按分类获取收藏
   */
  async findByCategory(category: string): Promise<ResultData> {
    try {
      const collections = await this.collectionRepository.find({
        where: { category },
        order: { createTime: "DESC" },
      });

      return ResultData.ok(collections);
    } catch (error) {
      return ResultData.fail(500, `获取分类收藏失败: ${error.message}`);
    }
  }
}

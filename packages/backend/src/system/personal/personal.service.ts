import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PersonalInfoEntity } from "./personal-info.entity";
import { CreatePersonalInfoDto } from "./dto/create-personal-info.dto";
import { UpdatePersonalInfoDto } from "./dto/update-personal-info.dto";
import { ResultData } from "../../common/utils/result";

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(PersonalInfoEntity)
    private readonly personalInfoRepository: Repository<PersonalInfoEntity>
  ) {}

  /**
   * 创建个人信息
   */
  async create(createDto: CreatePersonalInfoDto): Promise<ResultData> {
    try {
      const personalInfo = this.personalInfoRepository.create(createDto);
      const saved = await this.personalInfoRepository.save(personalInfo);
      return ResultData.ok(saved);
    } catch (error) {
      return ResultData.fail(500, "创建个人信息失败: " + error.message);
    }
  }

  /**
   * 获取所有个人信息
   */
  async findAll(): Promise<ResultData> {
    try {
      const list = await this.personalInfoRepository.find();
      return ResultData.ok(list);
    } catch (error) {
      return ResultData.fail(500, "获取个人信息列表失败: " + error.message);
    }
  }

  /**
   * 根据ID获取个人信息
   */
  async findOne(id: number): Promise<ResultData> {
    try {
      const personalInfo = await this.personalInfoRepository.findOne({
        where: { id },
      });
      if (!personalInfo) {
        return ResultData.fail(404, "个人信息不存在");
      }
      return ResultData.ok(personalInfo);
    } catch (error) {
      return ResultData.fail(500, "获取个人信息失败: " + error.message);
    }
  }

  /**
   * 更新个人信息
   */
  async update(updateDto: UpdatePersonalInfoDto): Promise<ResultData> {
    try {
      const { id, ...updateData } = updateDto;

      // 检查是否存在
      const existing = await this.personalInfoRepository.findOne({
        where: { id },
      });
      if (!existing) {
        return ResultData.fail(404, "个人信息不存在");
      }

      // 更新数据
      const updated = await this.personalInfoRepository.save({
        ...existing,
        ...updateData,
      });

      return ResultData.ok(updated);
    } catch (error) {
      return ResultData.fail(500, "更新个人信息失败: " + error.message);
    }
  }

  /**
   * 删除个人信息
   */
  async remove(id: number): Promise<ResultData> {
    try {
      const result = await this.personalInfoRepository.delete(id);
      if (result.affected === 0) {
        return ResultData.fail(404, "个人信息不存在");
      }
      return ResultData.ok("删除成功");
    } catch (error) {
      return ResultData.fail(500, "删除个人信息失败: " + error.message);
    }
  }

  /**
   * 根据用户ID获取或创建个人信息
   */
  async getOrCreateByUserId(userId: number): Promise<ResultData> {
    try {
      let personalInfo = await this.personalInfoRepository.findOne({
        where: { id: userId },
      });

      if (!personalInfo) {
        personalInfo = this.personalInfoRepository.create({
          nickname: "",
          gender: "保密",
        });
        personalInfo = await this.personalInfoRepository.save(personalInfo);
      }

      return ResultData.ok(personalInfo);
    } catch (error) {
      return ResultData.fail(500, "获取个人信息失败: " + error.message);
    }
  }
}

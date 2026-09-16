import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateAlgorithmProblemDto {
  @ApiProperty({ description: "题目标题", example: "两数之和" })
  @IsNotEmpty({ message: "题目标题不能为空" })
  @IsString()
  @MaxLength(255, { message: "题目标题长度不能超过255个字符" })
  title: string;

  @ApiProperty({
    description: "难度等级",
    enum: ["简单", "中等", "困难"],
    example: "中等",
  })
  @IsNotEmpty({ message: "难度等级不能为空" })
  @IsEnum(["简单", "中等", "困难"], {
    message: "难度等级只能是简单、中等或困难",
  })
  difficulty: "简单" | "中等" | "困难";

  @ApiProperty({ description: "算法分类", example: "数组" })
  @IsNotEmpty({ message: "算法分类不能为空" })
  @IsString()
  @MaxLength(100, { message: "算法分类长度不能超过100个字符" })
  category: string;

  @ApiProperty({
    description: "题目描述",
    example:
      "给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "解题思路",
    example:
      "使用哈希表存储遍历过的元素和对应的索引，每遍历一个元素，查找哈希表中是否存在目标值减去当前元素的值。",
  })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiProperty({
    description: "答案或代码",
    example:
      "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
  })
  @IsOptional()
  @IsString()
  answer?: string;
}

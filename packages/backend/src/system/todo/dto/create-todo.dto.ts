import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";

export class CreateTodoDto {
  @ApiProperty({ description: "待办事项标题", example: "完成项目文档" })
  @IsString({ message: "标题必须是字符串" })
  @IsNotEmpty({ message: "标题不能为空" })
  @MaxLength(255, { message: "标题长度不能超过255个字符" })
  title: string;

  @ApiProperty({ description: "是否完成", example: false, required: false })
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    description: "优先级",
    enum: ["高", "中", "低"],
    example: "中",
    required: false,
  })
  @IsOptional()
  @IsEnum(["高", "中", "低"], { message: "优先级必须是：高、中、低之一" })
  priority?: "高" | "中" | "低";
}

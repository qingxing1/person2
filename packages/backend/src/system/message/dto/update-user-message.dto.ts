import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsNumber,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserMessageDto {
  @ApiProperty({ description: "消息ID", example: 1 })
  @Transform(({ value }) => {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error("id 必须是有效的数字");
    }
    return num;
  })
  @IsNumber({}, { message: "id 类型错误，正确类型 number" })
  @IsNotEmpty({ message: "消息ID不能为空" })
  id: number;

  @ApiProperty({ description: "用户姓名", example: "张三", required: false })
  @IsString({ message: "name 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(50, { message: "用户姓名最多50个字符" })
  name?: string;

  @ApiProperty({
    description: "用户邮箱",
    example: "zhangsan@example.com",
    required: false,
  })
  @IsEmail({}, { message: "请输入正确的邮箱地址" })
  @IsOptional()
  @MaxLength(100, { message: "邮箱最多100个字符" })
  email?: string;

  @ApiProperty({
    description: "消息主题",
    example: "网站反馈建议",
    required: false,
  })
  @IsString({ message: "subject 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(100, { message: "消息主题最多100个字符" })
  subject?: string;

  @ApiProperty({
    description: "消息内容",
    example: "这是一个测试消息内容...",
    required: false,
  })
  @IsString({ message: "content 类型错误，正确类型 string" })
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "用户地址",
    example: "北京市海淀区中关村",
    required: false,
  })
  @IsString({ message: "address 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(200, { message: "用户地址最多200个字符" })
  address?: string;

  @ApiProperty({
    description: "消息状态",
    example: "read",
    enum: ["unread", "read"],
    required: false,
  })
  @IsEnum(["unread", "read"], { message: "status 只能是 unread 或 read" })
  @IsOptional()
  status?: "unread" | "read";
}

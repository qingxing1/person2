import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsNumber,
  MaxLength,
} from "class-validator";

export class UpdatePersonalInfoDto {
  @ApiProperty({ description: "个人信息ID", required: true })
  @IsNumber({}, { message: "id 类型错误，正确类型 number" })
  id: number;

  // 基本信息 - 全部可选
  @ApiProperty({ description: "昵称", required: false })
  @IsString({ message: "nickname 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(50, { message: "昵称最多50个字符" })
  nickname?: string;

  @ApiProperty({ description: "真实姓名", required: false })
  @IsString({ message: "realName 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(50, { message: "真实姓名最多50个字符" })
  realName?: string;

  @ApiProperty({ description: "座右铭/个人口号", required: false })
  @IsString({ message: "motto 类型错误，正确类型 string" })
  @IsOptional()
  @MaxLength(200, { message: "座右铭最多200个字符" })
  motto?: string;

  @ApiProperty({ description: "个人详细介绍", required: false })
  @IsString({ message: "bio 类型错误，正确类型 string" })
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: "性别",
    enum: ["男", "女", "保密"],
    required: false,
  })
  @IsEnum(["男", "女", "保密"], { message: "gender 只能是 男、女、保密" })
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: "出生日期", required: false })
  @IsDateString({}, { message: "birthday 类型错误，正确类型 date string" })
  @IsOptional()
  birthday?: Date;

  // 联系方式 - 全部可选
  @ApiProperty({ description: "邮箱地址", required: false })
  @IsEmail({}, { message: "请输入正确的邮箱地址" })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: "手机号码", required: false })
  @IsString({ message: "phone 类型错误，正确类型 string" })
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: "微信ID", required: false })
  @IsString({ message: "wechat 类型错误，正确类型 string" })
  @IsOptional()
  wechat?: string;

  @ApiProperty({ description: "QQ号", required: false })
  @IsString({ message: "qq 类型错误，正确类型 string" })
  @IsOptional()
  qq?: string;

  // 地理位置 - 全部可选
  @ApiProperty({ description: "所在地区", required: false })
  @IsString({ message: "location 类型错误，正确类型 string" })
  @IsOptional()
  location?: string;

  @ApiProperty({ description: "详细地址", required: false })
  @IsString({ message: "address 类型错误，正确类型 string" })
  @IsOptional()
  address?: string;

  // 技能与兴趣
  @ApiProperty({
    description: "技术栈列表",
    required: false,
    example: '["React", "TypeScript", "Node.js"]',
  })
  @IsOptional()
  skills?: JSON;

  @ApiProperty({
    description: "兴趣爱好列表",
    required: false,
    example: '["阅读", "健身", "编程"]',
  })
  @IsOptional()
  hobbies?: JSON;

  // 社交媒体 - 全部可选
  @ApiProperty({ description: "GitHub用户名", required: false })
  @IsString({ message: "github 类型错误，正确类型 string" })
  @IsOptional()
  github?: string;

  @ApiProperty({ description: "Gitee用户名", required: false })
  @IsString({ message: "gitee 类型错误，正确类型 string" })
  @IsOptional()
  gitee?: string;

  @ApiProperty({ description: "个人网站", required: false })
  @IsString({ message: "website 类型错误，正确类型 string" })
  @IsOptional()
  website?: string;

  // 教育信息
  @ApiProperty({ description: "简略学位", required: false })
  @IsString({ message: "degreeSimple 类型错误，正确类型 string" })
  @IsOptional()
  degreeSimple?: string;

  @ApiProperty({ description: "简略学校名称", required: false })
  @IsString({ message: "schoolSimple 类型错误，正确类型 string" })
  @IsOptional()
  schoolSimple?: string;

  @ApiProperty({
    description: "详细教育经历",
    required: false,
    example:
      '[{"year":"2017-2021","degree":"本科","major":"计算机科学","school":"XX大学","description":"..."}]',
  })
  @IsOptional()
  educationHistory?: JSON;

  // 工作与项目经历
  @ApiProperty({
    description: "工作经历",
    required: false,
    example:
      '[{"year":"2023-至今","position":"全栈工程师","company":"科技公司","description":"..."}]',
  })
  @IsOptional()
  workExperience?: JSON;

  @ApiProperty({
    description: "项目经历",
    required: false,
    example:
      '[{"title":"个人博客","description":"...","tech":["React","Node.js"],"link":"https://github.com/xxx"}]',
  })
  @IsOptional()
  projects?: JSON;

  // 个人评价模块（新增）
  @ApiProperty({ description: "自我评价", required: false })
  @IsString({ message: "selfEvaluation 类型错误，正确类型 string" })
  @IsOptional()
  selfEvaluation?: string;
}

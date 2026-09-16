import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class FindCollectionListDto {
  @ApiProperty({ description: "网站名称", required: false })
  @IsString({ message: "name 类型错误，正确类型 string" })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: "网站地址", required: false })
  @IsString({ message: "url 类型错误，正确类型 string" })
  @IsOptional()
  url?: string;

  @ApiProperty({ description: "收藏分类", required: false })
  @IsString({ message: "category 类型错误，正确类型 string" })
  @IsOptional()
  category?: string;

  @ApiProperty({ description: "页码", required: false, default: 1 })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 1 : num;
  })
  @IsNumber({}, { message: "page 类型错误，正确类型 number" })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: "每页数量", required: false, default: 10 })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 10 : num;
  })
  @IsNumber({}, { message: "size 类型错误，正确类型 number" })
  @IsOptional()
  size?: number = 10;
}

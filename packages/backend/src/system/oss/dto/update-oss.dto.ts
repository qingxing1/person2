import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateOssDto {
  @ApiProperty({ description: "文件id" })
  @IsString({ message: "id 类型错误，正确类型 string" })
  @IsNotEmpty({ message: "id 不能为空" })
  readonly id: string;

  @ApiProperty({ description: "业务描述" })
  @IsString({ message: "business 类型错误，正确类型 string" })
  @IsNotEmpty({ message: "business 不能为空" })
  @MaxLength(200, { message: "business 最大长度200" })
  readonly business: string;
}

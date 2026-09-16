import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("blog_config")
export class BlogConfigEntity {
  @ApiProperty({ description: "唯一标识符" })
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @ApiProperty({
    description: "分类数据",
    example: '[{"id":"1","name":"前端","slug":"frontend"}]',
  })
  @Column({ type: "json", comment: "分类数据" })
  categories: Array<{ id: string; name: string; slug: string }>;

  @ApiProperty({
    description: "标签数据",
    example: '[{"id":"1","name":"React","slug":"react"}]',
  })
  @Column({ type: "json", comment: "标签数据" })
  tags: Array<{ id: string; name: string; slug: string }>;
}

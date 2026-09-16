import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("algorithm_config")
export class AlgorithmProblemConfigEntity {
  @ApiProperty({ description: "唯一标识符" })
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @ApiProperty({
    description: "分类数据",
    example: '[{"id":"1","name":"数组","slug":"array"}]',
  })
  @Column({ type: "json", comment: "分类数据" })
  categories: Array<{ id: string; name: string; slug: string }>;
}

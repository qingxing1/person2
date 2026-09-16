import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("visit_stats")
export class VisitStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", comment: "统计日期" })
  date: string;

  @Column({ type: "int", default: 0, comment: "访问量" })
  count: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "创建时间",
  })
  createTime: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "更新时间",
  })
  updateTime: Date;
}

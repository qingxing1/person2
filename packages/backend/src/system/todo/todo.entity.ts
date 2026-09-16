import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type PriorityType = "高" | "中" | "低";

@Entity("todo_list")
export class TodoEntity {
  @PrimaryGeneratedColumn({ type: "bigint", comment: "主键ID" })
  id: number;

  @Column({ type: "varchar", length: 255, comment: "待办事项标题" })
  title: string;

  @Column({
    type: "tinyint",
    width: 1,
    default: 0,
    comment: "是否完成 (0:未完成, 1:已完成)",
  })
  completed: boolean;

  @Column({
    type: "enum",
    enum: ["高", "中", "低"],
    default: "中",
    comment: "优先级",
  })
  priority: PriorityType;

  @CreateDateColumn({ name: "create_time", comment: "创建时间" })
  createTime: Date;

  @UpdateDateColumn({ name: "update_time", comment: "更新时间" })
  updateTime: Date;
}

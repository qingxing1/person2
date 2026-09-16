import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("user_collections")
export class UserCollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, comment: "网站名称" })
  name: string;

  @Column({ type: "varchar", length: 500, comment: "网站地址" })
  url: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    comment: "网站图标URL",
  })
  icon: string;

  @Column({
    type: "varchar",
    length: 20,
    default: "其他",
    comment: "收藏分类",
  })
  category: string;

  @Column({ type: "varchar", length: 200, nullable: true, comment: "备注信息" })
  description: string;

  @CreateDateColumn({
    name: "create_time",
    type: "datetime",
    comment: "收藏日期",
  })
  createTime: Date;
}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionService } from "./collection.service";
import { CollectionController } from "./collection.controller";
import { UserCollectionEntity } from "./user-collection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserCollectionEntity])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}

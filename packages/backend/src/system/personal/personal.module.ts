import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonalService } from "./personal.service";
import { PersonalController } from "./personal.controller";
import { PersonalInfoEntity } from "./personal-info.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInfoEntity])],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService],
})
export class PersonalModule {}

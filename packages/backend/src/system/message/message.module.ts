import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { UserMessageEntity } from './user-message.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserMessageEntity])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule {}
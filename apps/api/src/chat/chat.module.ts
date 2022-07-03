import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MessageEntity } from './entity/message.entity';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './service/chat.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([MessageEntity])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}

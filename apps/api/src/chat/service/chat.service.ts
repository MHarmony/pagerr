import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/service/auth.service';
import { UserEntity } from '../../user/entity/user.entity';
import { MessageEntity } from '../entity/message.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>
  ) {}

  async saveMessage(content: string, author: UserEntity): Promise<MessageEntity> {
    const newMessage = this.messageRepository.create({
      content,
      author
    });

    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async getAllMessages(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      relations: ['author']
    });
  }

  async getUserFromSocket(socket: Socket): Promise<UserEntity> {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken
    );

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
}

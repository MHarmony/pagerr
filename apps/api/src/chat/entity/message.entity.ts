import { Message } from '@pagerr/api-interfaces';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'message' })
export class MessageEntity implements Message {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public content: string;

  @ManyToOne(() => UserEntity)
  public author: UserEntity;
}

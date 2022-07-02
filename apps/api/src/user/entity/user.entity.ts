import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { User } from '@pagerr/api-interfaces';

@Entity({ name: 'user' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  public username: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public hashedRefreshToken?: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @CreateDateColumn()
  public dateCreated: Date;

  @UpdateDateColumn()
  public dateUpdated: Date;
}

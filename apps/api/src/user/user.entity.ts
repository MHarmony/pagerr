import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { User } from '@pagerr/api-interfaces';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsString()
  @IsUUID()
  public id?: string;

  @Column({ unique: true })
  @IsString()
  @IsEmail()
  public email: string;

  @Column()
  @IsString()
  public username: string;

  @Column()
  @IsString()
  public password: string;

  @CreateDateColumn()
  @IsDate()
  public dateCreated: Date;

  @UpdateDateColumn()
  @IsDate()
  public dateUpdated: Date;
}

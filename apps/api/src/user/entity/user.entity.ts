import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@pagerr/api-interfaces';
import { DatabaseFileEntity } from '../../database-file/entity/database-file.entity';

@Entity({ name: 'user' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: "The user's ID", example: uuidv4() })
  public id: string;

  @Column({ unique: true })
  @ApiProperty({ description: "The user's email", example: 'user@email.com' })
  public email: string;

  @Column({ unique: true })
  @ApiProperty({ description: "The user's username", example: 'johndoe' })
  public username: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  @ApiProperty({
    description: "The user's role",
    enum: Role,
    default: Role.USER,
    example: Role.USER
  })
  public role: Role;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFileEntity, {
    nullable: true
  })
  public avatar?: DatabaseFileEntity;

  @Column({ nullable: true })
  @ApiProperty({
    description: "The user's avatar ID",
    example: uuidv4(),
    required: false
  })
  public avatarId?: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public hashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthSecret?: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Is the user using 2FA?',
    default: false,
    example: false
  })
  public isTwoFactorAuthEnabled: boolean;

  @Column({ default: false })
  @ApiProperty({
    description: "Is the user's email confirmed?",
    default: false,
    example: false
  })
  public isEmailConfirmed: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date the user was created',
    default: 'CURRENT_TIMESTAMP',
    example: new Date()
  })
  public dateCreated: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date the user was last updated',
    default: 'CURRENT_TIMESTAMP',
    example: new Date()
  })
  public dateUpdated: Date;
}

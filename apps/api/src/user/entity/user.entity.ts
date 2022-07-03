import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { v4 as uuid4 } from 'uuid';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@pagerr/api-interfaces';

@Entity({ name: 'user' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: "The user's ID", example: uuid4() })
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

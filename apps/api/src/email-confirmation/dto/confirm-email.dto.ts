import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The confirmation token', example: 'supersecrettoken' })
  public token: string;
}

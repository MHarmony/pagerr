import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ description: 'The login email', example: 'user@email.com' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The login username', example: 'johndoe' })
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-__+.])(?=.*[0-9])(?=.*[a-z])$/ // 1 uppercase, 1 special, 1 number, 1 lowercase
  )
  @ApiProperty({
    description:
      'The login password\n\nMust include at least:\n\n\t1 uppercase\n\n\t1 lowercase\n\n\t1 number\n\n\t1 special character',
    example: 'B7i^Ct*DNXB$Qk88!EZA',
    minLength: 8
  })
  public password: string;
}

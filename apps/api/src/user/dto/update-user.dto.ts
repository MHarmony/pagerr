import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-__+.])(?=.*[0-9])(?=.*[a-z])$/ // 1 uppercase, 1 special, 1 numer, 1 lowercase
  )
  public password: string;
}

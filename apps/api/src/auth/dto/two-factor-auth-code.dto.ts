import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthCodeDto {
  @IsString()
  @IsNotEmpty()
  public twoFactorAuthCode: string;
}

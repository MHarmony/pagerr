import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  public context: string;

  @IsString()
  @IsNotEmpty()
  public message: string;

  @IsString()
  @IsNotEmpty()
  public level: string;
}

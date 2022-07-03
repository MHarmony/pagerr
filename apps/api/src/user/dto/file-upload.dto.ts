import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import { IsNotEmpty } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

export class FileUploadDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'An avatar for the user',
    type: 'string',
    format: 'binary'
  })
  file: Express.Multer.File;
}

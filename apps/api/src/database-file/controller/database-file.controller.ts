import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';
import { DatabaseFileService } from '../service/database-file.service';

@Controller('databaseFile')
@ApiTags('databaseFile')
export class DatabaseFileController {
  constructor(private readonly databaseFileService: DatabaseFileService) {}

  @Get(':id')
  @ApiOperation({
    description: 'Get a database file by ID',
    summary: 'Get a database file by ID'
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({
    description: 'Successfully retrieved the database file'
  })
  @ApiNotFoundResponse({
    description: 'Could not find the database file'
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the database file'
  })
  public async getById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    const file = await this.databaseFileService.getById(id);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`
    });

    return new StreamableFile(stream);
  }
}

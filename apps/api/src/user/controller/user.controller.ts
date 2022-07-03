import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RequestWithUser } from '../../auth/interface/request-with-user.interface';
import { DatabaseFileService } from '../../database-file/service/database-file.service';
import { FileUploadDto } from '../dto/file-upload.dto';
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly databaseFileService: DatabaseFileService
  ) {}

  @Get(':id/avatar')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Get an avatar for a user',
    summary: 'Get an avatar for a user'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the avatar' })
  @ApiNotFoundResponse({ description: 'The user does not have an avatar' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the avatar'
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  public async getAvatar(@Param('id') id: string, @Res() response: Response) {
    const user = await this.userService.getById(id);
    const fileId = user.avatarId;

    if (!fileId) {
      throw new NotFoundException();
    }

    const file = await this.databaseFileService.getById(id);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image'
    });

    response.send(new StreamableFile(stream));
  }

  @Post('avatar')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Add an avatar for the current user',
    summary: 'Add an avatar for the current user'
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Successfully added the avatar' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while adding the avatar'
  })
  @ApiBody({ description: 'An avatar for the user', type: FileUploadDto })
  public async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }
}

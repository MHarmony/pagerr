import { Controller, Post, Req, UploadedFile, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { Express } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RequestWithUser } from '../../auth/interface/request-with-user.interface';
import { FileUploadDto } from '../dto/file-upload.dto';
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Add an avatar for a user',
    summary: 'Add an avatar for a user'
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

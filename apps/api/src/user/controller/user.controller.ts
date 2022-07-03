import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Role } from '@pagerr/api-interfaces';
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { RequestWithUser } from '../../auth/interface/request-with-user.interface';
import { DatabaseFileService } from '../../database-file/service/database-file.service';
import { HttpCacheInterceptor } from '../../util/http-cache-interceptor/http-cache.interceptor';
import { GET_USERS_CACHE_KEY } from '../constants/user.constants';
import { FileUploadDto } from '../dto/file-upload.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly databaseFileService: DatabaseFileService
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_USERS_CACHE_KEY)
  @CacheTTL(120)
  @ApiOperation({
    description: 'Get all users',
    summary: 'Get all users'
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all users',
    type: UserEntity,
    isArray: true
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the users'
  })
  public async getUsers(): Promise<UserEntity[]> {
    return this.userService.get();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Get a user by ID',
    summary: 'Get a user by ID'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the user', type: UserEntity })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the user'
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  public async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getById(id);
  }

  @Get(':email')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Get a user by email',
    summary: 'Get a user by email'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the user', type: UserEntity })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the user'
  })
  public async getUserByEmail(@Param('email') email: string): Promise<UserEntity> {
    return this.userService.getById(email);
  }

  @Get(':username')
  @UseGuards(JwtGuard)
  @ApiOperation({
    description: 'Get a user by username',
    summary: 'Get a user by username'
  })
  @ApiOkResponse({ description: 'Successfully retrieved the user', type: UserEntity })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred while retrieving the user'
  })
  public async getUserByUsername(
    @Param('username') username: string
  ): Promise<UserEntity> {
    return this.userService.getByUsername(username);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiExcludeEndpoint()
  public async updateUser(@Param() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiExcludeEndpoint()
  public async delete(@Param() id: string): Promise<void> {
    return this.userService.delete(id);
  }

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

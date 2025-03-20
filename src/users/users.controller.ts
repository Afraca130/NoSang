import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetProfile } from './decorators/get-profile.decorator';
import { ProfileImageInterceptor } from './interceptors/profile-image.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    // Remove password from response
    const { password, refreshToken, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetProfile() profile) {
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(
      userId,
      updateProfileDto,
    );

    const { password, refreshToken, ...result } = updatedUser;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/image')
  @UseInterceptors(ProfileImageInterceptor())
  async uploadProfileImage(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('이미지 파일을 업로드해주세요.');
    }

    // 파일 경로를 DB에 저장
    const imageUrl = `/uploads/profiles/${file.filename}`;
    const updatedUser = await this.usersService.updateProfileImage(
      userId,
      imageUrl,
    );

    const { password, refreshToken, ...result } = updatedUser;
    return {
      ...result,
      message: '프로필 이미지가 성공적으로 업로드되었습니다.',
      imageUrl,
    };
  }
}

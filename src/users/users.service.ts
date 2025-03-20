import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Check if user with the same username or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists',
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByUsernameWithPassword(
    username: string,
  ): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }

  // 추가된 프로필 관련 메서드
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 업데이트할 필드만 적용
    if (updateProfileDto.username) user.username = updateProfileDto.username;
    if (updateProfileDto.phoneNumber)
      user.phoneNumber = updateProfileDto.phoneNumber;
    if (updateProfileDto.gender) user.gender = updateProfileDto.gender;

    return this.usersRepository.save(user);
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.imageUrl = imageUrl;
    return this.usersRepository.save(user);
  }

  async addPoints(userId: string, points: number): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.point += points;

    // 포인트에 따른 티어 업데이트 로직도 여기에 추가할 수 있음

    return this.usersRepository.save(user);
  }
}

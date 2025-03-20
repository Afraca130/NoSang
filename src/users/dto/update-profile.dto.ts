import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { GenderType } from '../entities/user.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;
}

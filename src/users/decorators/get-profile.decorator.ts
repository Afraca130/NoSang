import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export type ProfileData = {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  point: number;
  tier: string;
  phoneNumber: string;
  gender: string;
  signUpType: string;
};

export const GetProfile = createParamDecorator(
  (data: keyof ProfileData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      return null;
    }

    // 민감한 정보 제외한 프로필 데이터
    const profile: ProfileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      point: user.point,
      tier: user.tier,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      signUpType: user.signUpType,
    };

    return data ? profile[data] : profile;
  },
);

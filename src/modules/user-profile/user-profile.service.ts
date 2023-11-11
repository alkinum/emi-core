import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { deepMerge } from 'lodash';
import { Repository } from 'typeorm';

import { UserProfile } from './user-profile.entity';

import { User } from '@/modules/user/user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUserProfile(user: User): Promise<string> {
    const cached: any = await this.cacheManager.get(`profile-${user.id}`);
    if (cached) {
      return cached;
    }

    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.id } },
    });
    const profileData = profile ? profile.profileData : null;
    await this.cacheManager.set(`profile-${user.id}`, profileData, 300);
    return profileData;
  }

  async setUserProfile(user: User, newProfileData: string): Promise<boolean> {
    let profile = await this.userProfileRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!profile) {
      profile = new UserProfile();
      profile.user = { id: user.id } as User;
      profile.profileData = newProfileData;
    } else {
      try {
        const parsedNewData = JSON.parse(newProfileData);
        const parsedStoredData = JSON.parse(profile.profileData);
        profile.profileData = JSON.stringify(
          deepMerge(parsedStoredData, parsedNewData),
        );
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new BadRequestException('无效的 JSON 字符串');
        } else {
          throw error;
        }
      }
    }

    await this.userProfileRepository.save(profile);
    await this.cacheManager.del(`profile-${user.id}`);
    return true;
  }
}

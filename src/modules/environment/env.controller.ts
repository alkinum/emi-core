// chat.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiKeyGuard, ApiUserRequest } from '../api-key/api-key.guard';
import { Response } from '../global/response';

import { UserProfile } from '@/modules/user-profile/user-profile.entity';
import { UserProfileService } from '@/modules/user-profile/user-profile.service';
import { getFormattedTime } from '@/utils/date';

@ApiTags('Environment')
@Controller('env')
export class EnvController {
  constructor(private userProfileService: UserProfileService) {}

  @Get('init')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Get necessary initial information of chat environment.',
    description: 'Returns the user profile and current time in GMT+0.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile and current time.',
    type: Response<{ userProfile: UserProfile; currentTime: string }>,
  })
  async init(@Req() req: ApiUserRequest) {
    const user = req.user;
    const userProfile = await this.userProfileService.getUserProfile(user);
    const currentTime = getFormattedTime(new Date());

    return { userProfile, currentTime };
  }
}

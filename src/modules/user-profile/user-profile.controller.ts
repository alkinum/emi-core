import { Controller, Get, Body, UseGuards, Req, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApiKeyGuard, ApiUserRequest } from '../api-key/api-key.guard';

import { UserProfileDto } from './update-profile.dto';
import { UserProfileService } from './user-profile.service';

import { Response } from '@/modules/global/response';

@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get('get')
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile from databse, the profile is a JSON string.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A general response structure with user profile data as a pure JSON string.',
    type: Response<string>,
  })
  async getProfile(@Req() req: ApiUserRequest): Promise<any> {
    return this.userProfileService.getUserProfile(req.user);
  }

  @Post('update')
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update user profile to database, all the properties in the request data will be merged into the stored profile.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A general response structure with a boolean data, if data is true, the profile is updated successfully.',
    type: Response<boolean>,
  })
  async updateProfile(
    @Req() req: ApiUserRequest,
    @Body() profileDto: UserProfileDto,
  ): Promise<any> {
    return this.userProfileService.setUserProfile(
      req.user,
      profileDto.userProfile,
    );
  }
}

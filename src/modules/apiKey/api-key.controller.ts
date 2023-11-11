import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserJwtPayload } from '../auth/jwt.strategy';

import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';
import { RevokeApiKeyDto } from './revoke-api-key.dto';

import { JwtAuthGuard } from '@/modules/auth/jwt.guard';

@Controller('api-key')
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req): Promise<ApiKey> {
    const userPayload = req.user as UserJwtPayload;
    return this.apiKeyService.createApiKey(userPayload.sub);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Request() req): Promise<ApiKey[]> {
    const userPayload = req.user as UserJwtPayload;
    return this.apiKeyService.listApiKeys(userPayload.sub);
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard)
  async revoke(
    @Request() req,
    @Body() revokeApiKeyDto: RevokeApiKeyDto,
  ): Promise<void> {
    const user = req.user as UserJwtPayload;
    await this.apiKeyService.revokeApiKey(user.sub, revokeApiKeyDto.apiKey);
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { ApiKeyService } from './api-key.service';

import { User } from '@/modules/user/user.entity';

export interface ApiUserRequest extends FastifyRequest {
  user?: User;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ApiUserRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('API 密钥缺失');
    }

    const [bearer, apiKey] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !apiKey || !apiKey.startsWith('ek-')) {
      throw new UnauthorizedException('无效的 API 密钥格式');
    }

    const user = await this.apiKeyService.validateApiKeyAndGetUser(apiKey);
    if (!user) {
      throw new UnauthorizedException('无效的 API 密钥');
    }

    request.user = user;

    return true;
  }
}

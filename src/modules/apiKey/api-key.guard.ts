import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('API 密钥缺失');
    }

    const [bearer, apiKey] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !apiKey) {
      throw new UnauthorizedException('无效的 API 密钥格式');
    }

    const isValid = await this.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('无效的 API 密钥');
    }

    return true;
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    return await this.apiKeyService.keyExists(apiKey);
  }
}

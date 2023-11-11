import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';

import { ApiKey } from './api-key.entity';

import { User } from '@/modules/user/user.entity';

@Injectable()
export class ApiKeyService {
  private readonly nanoid = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    40,
  );

  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async listApiKeys(userId: string): Promise<ApiKey[]> {
    return this.apiKeyRepository.find({ where: { user: { id: userId } } });
  }

  generateApiKey(): string {
    const prefix = 'ek-';
    return prefix + this.nanoid(); // 使用 nanoid 生成的随机字符
  }

  async createApiKey(userId: string): Promise<ApiKey> {
    const apiKey = new ApiKey();
    apiKey.key = this.generateApiKey(); // 使用 nanoid 生成的 API 密钥
    apiKey.createdAt = new Date();
    apiKey.user = await this.userService.getUserById(userId);

    return this.apiKeyRepository.save(apiKey);
  }

  async keyExists(key: string): Promise<boolean> {
    const cached: ApiKey = await this.cacheManager.get(key);
    if (cached) {
      return true;
    }

    const apiKey = await this.apiKeyRepository.findOne({ where: { key } });
    if (apiKey) {
      await this.cacheManager.set(key, apiKey, 300);
      return true;
    }
    return false;
  }

  async revokeApiKey(userId: string, key: string): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { key },
      relations: ['user'],
    });

    if (!apiKey || apiKey.user.id !== userId) {
      throw new UnauthorizedException('您无权撤销这个 API 密钥');
    }

    await this.apiKeyRepository.remove(apiKey);
    await Promise.all([
      this.cacheManager.del(key),
      this.cacheManager.del(`api-key-user:${key}`),
    ]);
  }

  async validateApiKeyAndGetUser(apiKey: string): Promise<User | null> {
    const cacheKey = `api-key-user:${apiKey}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const apiKeyEntity = await this.apiKeyRepository.findOne({
      where: { key: apiKey },
      relations: ['user'],
    });

    if (apiKeyEntity && apiKeyEntity.user) {
      await this.cacheManager.set(cacheKey, apiKeyEntity.user, 300);
      return apiKeyEntity.user;
    }

    return null;
  }
}

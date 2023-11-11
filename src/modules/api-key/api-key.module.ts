import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';

import { ApiKeyController } from './api-key.controller';
import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    CacheModule.register(),
    UserModule,
  ],
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}

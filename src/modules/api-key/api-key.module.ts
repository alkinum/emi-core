import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthModule } from '../auth/jwt.module';
import { UserModule } from '../user/user.module';

import { ApiKeyController } from './api-key.controller';
import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    CacheModule.register(),
    UserModule,
    JwtAuthModule,
  ],
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}

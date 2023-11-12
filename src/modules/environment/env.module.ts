// chat.module.ts
import { Module } from '@nestjs/common';

import { ApiKeyModule } from '../api-key/api-key.module';
import { UserProfileModule } from '../user-profile/user-profile.module';

import { EnvController } from './env.controller';

@Module({
  controllers: [EnvController],
  imports: [UserProfileModule, ApiKeyModule],
})
export class EnvModule {}

// chat.module.ts
import { Module } from '@nestjs/common';

import { UserProfileModule } from '../user-profile/user-profile.module';

import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  imports: [UserProfileModule],
})
export class ChatModule {}

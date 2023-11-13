import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { TurnstileService } from '../turnstile/turnstile.service';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService, TurnstileService],
  exports: [UserService],
})
export class UserModule {}

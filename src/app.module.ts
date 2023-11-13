import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { ApiKeyModule } from './modules/api-key/api-key.module';
import { EnvModule } from './modules/environment/env.module';
import { HttpExceptionFilter } from './modules/global/httpExceptionFilter';
import { TransformInterceptor } from './modules/global/transformInterceptor';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';

dotenv.config();

@Module({
  imports: [
    // global
    TypeOrmModule.forRoot({
      type: 'mysql', // 根据实际数据库类型调整
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'production', // 生产环境中应设置为false
      autoLoadEntities: true,
    }),
    // business
    ApiKeyModule,
    EnvModule,
    HealthModule,
    UserModule,
    UserProfileModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

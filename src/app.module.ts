import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { HttpExceptionFilter } from './modules/global/httpExceptionFilter';
import { TransformInterceptor } from './modules/global/transformInterceptor';
import { HealthModule } from './modules/health/health.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';

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
      entities: [User],
      synchronize: true, // 生产环境中应设置为false
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 从环境变量中获取秘钥
      signOptions: { expiresIn: '60m' }, // 设置 token 过期时间
    }),
    // business
    HealthModule,
    UserModule,
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

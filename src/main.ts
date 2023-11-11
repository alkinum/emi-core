import * as cookie from '@fastify/cookie';
import * as session from '@fastify/session';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(cookie);
  app.register(session, {
    secret: process.env.SESSION_SECRET || 'emi-core',
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 如果是生产环境，则开启安全cookie
    },
  });

  await app.listen(3000);
}

bootstrap();

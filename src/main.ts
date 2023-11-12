import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(cookie);
  app.register(session, {
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 如果是生产环境，则开启安全cookie
    },
  });

  app.enableCors({
    origin: ['https://emi.alkinum.io'],
    methods: 'GET,POST',
  });

  const config = new DocumentBuilder()
    .setTitle('Emi Actions API')
    .setDescription('All the actions that Emi can call.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();

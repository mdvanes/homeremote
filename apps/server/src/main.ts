/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from "cookie-parser";
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = ''; // Was generated with 'api'
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix} in ${process.env.NODE_ENV} mode`
  );
}

bootstrap();

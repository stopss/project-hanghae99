import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import * as fs from 'fs';
// import * as csurf from 'csurf';
// import * as cookieParser from 'cookie-parser';
// import * as session from 'express-session';

async function bootstrap() {
  const httpsOptions = {
    ca: fs.readFileSync('/etc/letsencrypt/live/whoru-back.kr/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/whoru-back.kr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/whoru-back.kr/cert.pem'),
  };
  const appHttps = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    httpsOptions,
  });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  appHttps.enableCors({
    origin: 'https:whoru.name',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });
  // appHttps.use(cookieParser());
  // appHttps.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  appHttps.useGlobalPipes(new ValidationPipe());
  appHttps.useGlobalFilters(new HttpExceptionFilter());
  appHttps.setBaseViewsDir(join(__dirname, '../views'));
  appHttps.useStaticAssets(join(__dirname, '../public'));
  appHttps.setViewEngine('hbs');
  appHttps.use(helmet());
  // appHttps.use(csurf());

  const logger = new Logger('MAIN');

  const HTTPS_SERVER_PORT = process.env.HTTPS_SERVER_PORT;
  const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT;
  await appHttps
    .listen(HTTPS_SERVER_PORT)
    .then(() => logger.log(`The server is on ${HTTPS_SERVER_PORT}`));
  await app
    .listen(SOCKET_SERVER_PORT)
    .then(() => logger.log(`The Socket server is on ${SOCKET_SERVER_PORT}`));
}
bootstrap();

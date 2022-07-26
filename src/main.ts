import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import * as fs from 'fs';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
<<<<<<< HEAD
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
  console.log('8080번에서 대기중.....');
=======
  const httpsOptions = {
    key: fs.readFileSync(__dirname + '/../src/secrets/private-key.pem'),
    cert: fs.readFileSync(__dirname + '/../src/secrets/public-certificate.pem'),
  };
  const appHttps = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    httpsOptions,
  });
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  appHttps.enableCors();
  appHttps.use(cookieParser());
  appHttps.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  appHttps.useGlobalPipes(new ValidationPipe());
  appHttps.useGlobalFilters(new HttpExceptionFilter());
  appHttps.setBaseViewsDir(join(__dirname, '../views'));
  appHttps.useStaticAssets(join(__dirname, '../public'));
  appHttps.setViewEngine('hbs');
  appHttps.use(helmet());
  appHttps.use(csurf());

  const logger = new Logger('MAIN');

  const HTTPS_SERVER_PORT = process.env.HTTPS_SERVER_PORT;
  const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT;
  await appHttps.listen(HTTPS_SERVER_PORT).then(() => logger.log(`The server is on ${HTTPS_SERVER_PORT}`));
  await app.listen(SOCKET_SERVER_PORT).then(() => logger.log(`The Socket server is on ${SOCKET_SERVER_PORT}`));
>>>>>>> setup-packages
}
bootstrap();

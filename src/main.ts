import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import helmet from 'helmet';
import * as fs from 'fs';
import * as csurf from 'csurf';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(__dirname + '/../src/secrets/private-key.pem'),
    cert: fs.readFileSync(__dirname + '/../src/secrets/public-certificate.pem'),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    httpsOptions,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setBaseViewsDir(join(__dirname, '../views'));
  app.useStaticAssets(join(__dirname, '../public'));
  app.setViewEngine('hbs');
  app.use(helmet());
  app.use(csurf());

  const PORT = process.env.PORT;
  await app.listen(PORT);
  const logger = new Logger('MAIN');
  logger.log(`The server is on`);
}
bootstrap();

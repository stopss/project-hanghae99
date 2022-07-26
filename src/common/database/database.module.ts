import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { databaseProviders } from './database.provider';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

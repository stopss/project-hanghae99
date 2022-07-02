import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { CurrentUsersProviders } from './current.users.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...CurrentUsersProviders],
})
export class CurrentUsersModule {}

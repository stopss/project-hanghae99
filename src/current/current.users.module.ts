import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { CurrentUsersProviders } from './current.users.provider';
import { CurrentUsersService } from './services/current.service';

@Module({
  imports: [DatabaseModule],
  providers: [...CurrentUsersProviders, CurrentUsersService],
  exports: [CurrentUsersService],
})
export class CurrentUsersModule {}

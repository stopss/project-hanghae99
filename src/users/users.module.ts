import { DatabaseModule } from './../common/database/database.module';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { userProviders } from './models/users.provider';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

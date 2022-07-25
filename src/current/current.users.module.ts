import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { CurrentUsersProviders } from './models/current.users.provider';
import { CurrentUsersService } from './services/current.service';
import { CurrentController } from './controllers/current.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    DatabaseModule,
    forwardRef(() => UsersModule),
  ],
  providers: [...CurrentUsersProviders, CurrentUsersService],
  exports: [CurrentUsersService],
  controllers: [CurrentController],
})
export class CurrentUsersModule {}

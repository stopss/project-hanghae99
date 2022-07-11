import { forwardRef, Module, Controller } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { LogController } from './controllers/log.controller';
import { logProviders } from './models/log.provider';
import { LogService } from './services/log.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  controllers: [LogController],
  providers: [LogService, ...logProviders],
  exports: [LogService],
})
export class LogModule {}

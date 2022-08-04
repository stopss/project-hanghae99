import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from 'src/common/database/database.module';
import { EpisodeController } from './controllers/episode.controllers';
import { episodeProviders } from './episode.provider';
import { EpisodeService } from './services/episode.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    DatabaseModule,
  ],
  providers: [EpisodeService, ...episodeProviders],
  controllers: [EpisodeController],
  exports: [EpisodeService],
})
export class EpisodeModule {}

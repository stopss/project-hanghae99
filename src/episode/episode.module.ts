import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { EpisodeController } from './controllers/episode.controllers';
import { episodeProviders } from './episode.provider';
import { EpisodeService } from './services/episode.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [EpisodeService, ...episodeProviders],
  controllers: [EpisodeController],
  exports: [EpisodeService],
})
export class EpisodeModule {}

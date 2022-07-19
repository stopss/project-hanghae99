import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { episodeProviders } from './episode.provider';
import { EpisodeService } from './episode.service';

@Module({
  imports: [DatabaseModule],
  providers: [EpisodeService, ...episodeProviders],
  exports: [EpisodeService],
})
export class EpisodeModule {}

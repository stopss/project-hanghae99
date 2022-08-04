import { EpisodeService } from 'src/episode/services/episode.service';
import { Controller, Get, Logger } from '@nestjs/common';

@Controller('roles')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  getRole() {
    const logger = new Logger('DEBUG');
    logger.debug('GET ROLES');
    return this.episodeService.allRole();
  }
}

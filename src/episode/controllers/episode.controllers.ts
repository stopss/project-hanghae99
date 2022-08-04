import { EpisodeService } from 'src/episode/services/episode.service';
import { Controller, Get } from '@nestjs/common';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get('roles')
  getRole() {
    return this.episodeService.allRole();
  }
}

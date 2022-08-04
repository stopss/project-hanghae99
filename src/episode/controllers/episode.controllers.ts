import { EpisodeService } from 'src/episode/services/episode.service';
import { Controller, Get } from '@nestjs/common';

@Controller('roles')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  getRole() {
    return this.episodeService.allRole();
  }
}

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { EpisodeService } from 'src/episode/services/episode.service';
import { Controller, Get, UseGuards, Logger, Req } from '@nestjs/common';

@Controller('roles')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getRole(@Req() req) {
    const logger = new Logger('DEBUG');
    logger.debug(`[GET ROLES] ${req.user.email}`);
    return this.episodeService.allRole();
  }
}

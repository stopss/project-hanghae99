import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EpisodeEntity } from './episode.entity';

@Injectable()
export class EpisodeService {
  constructor(
    @Inject('EPISODE_REPOSITORY')
    private readonly episodeRepository: Repository<EpisodeEntity>,
  ) {}
  async findEpisodeById(episodeId: number) {
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
    });
    return episode;
  }

  // async findEpisodeByRole(role: string) {
  //   const episode = await this.episodeRepository.find({ where: { role } });
  //   return episode;
  // }
}

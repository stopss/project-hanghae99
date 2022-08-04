import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImageEntity } from './images.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imagesRepository: Repository<ImageEntity>,
    private dataSource: DataSource,
  ) {}

  async findListsByRoomId(roomId: number) {
    const lists = await this.imagesRepository
      .find({ where: { roomId } })
      .then((res) => res)
      .catch((err) => err);
    return lists;
  }

  async registerImageUrlLists(
    roomId: number,
    userId: number,
    imageUrlLists: Array<string>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < imageUrlLists.length; i++) {
        const imageUrl = new ImageEntity();
        imageUrl.roomId = roomId;
        imageUrl.userId = userId;
        imageUrl.imageUrlLists = imageUrlLists[i].toString();
        await this.imagesRepository.save(imageUrl);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }

    return { success: true };
  }
}

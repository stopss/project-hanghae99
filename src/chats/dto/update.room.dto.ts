import { IsString } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  title: string;

  @IsString()
  password: string;

  @IsString()
  hintTime: string;

  @IsString()
  reasoningTime: string;

  @IsString()
  isRandom: string;

  @IsString()
  roomId: string;

  @IsString()
  master: string;
}

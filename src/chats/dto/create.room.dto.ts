import { IsString } from 'class-validator';

export class CreateRoomDto {
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
}

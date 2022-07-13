import { IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  count: number;

  @IsString()
  roomUniqueId: string;

  @IsString()
  roomState: string;
}

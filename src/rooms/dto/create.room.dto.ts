import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  title: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  hintTime: string;

  @IsNotEmpty()
  reasoningTime: string;

  @IsNotEmpty()
  isRandom: string;
}

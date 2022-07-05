import { IsString } from 'class-validator';

export class SearchRoomDto {
  @IsString()
  type: string;

  @IsString()
  inputValue: string;
}
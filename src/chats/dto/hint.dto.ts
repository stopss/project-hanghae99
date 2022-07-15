import { IsBoolean, IsNumber, IsString } from 'class-validator';
export class HintDto {
  @IsString()
  id: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsBoolean()
  isDropped: boolean;

  @IsString()
  previewUrl: string;
}

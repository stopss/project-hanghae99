import { IsString } from 'class-validator';
export class ImageRegisterDto {
  @IsString()
  imageUrl: string;
}

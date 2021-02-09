import { IsString } from 'class-validator';

export class SetConfigDto {
  @IsString()
  name: string;
  @IsString()
  url_base: string;
}

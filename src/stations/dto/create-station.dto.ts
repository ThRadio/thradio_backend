import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateStationDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  icecast_password: string;
  @IsNumber()
  icecast_port: number;
  @IsString()
  @IsOptional()
  genre?: string;
}

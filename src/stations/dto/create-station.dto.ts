import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
  @IsNumber()
  @IsOptional()
  listeners?: number;
  @Type(() => CreateUserDto)
  @ValidateNested()
  @IsOptional()
  user: CreateUserDto;
}

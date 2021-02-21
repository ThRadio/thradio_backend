import { PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateStationDto } from './create-station.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStationDto extends PartialType(CreateStationDto) {
  @Type(() => UpdateUserDto)
  @ValidateNested()
  @IsOptional()
  user?: UpdateUserDto;
}

import { PartialType } from '@nestjs/swagger';
import { CreateStationDto } from './create-station.dto';

export class UpdateStationDto extends PartialType(CreateStationDto) {}

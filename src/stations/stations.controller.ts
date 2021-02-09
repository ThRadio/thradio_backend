import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
//Swagger
import { ApiTags } from '@nestjs/swagger';
//Services
import { StationsService } from './stations.service';
//Classes
import { StationClass } from './classes/station.class';
//Dto
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  async create(
    @Body() createStationDto: CreateStationDto,
  ): Promise<StationClass> {
    return await this.stationsService.create(createStationDto);
  }

  @Get()
  async findAll(): Promise<StationClass[]> {
    return await this.stationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StationClass> {
    return await this.stationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ): Promise<StationClass> {
    return await this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stationsService.remove(id);
  }
}

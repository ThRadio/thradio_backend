import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  async create(@Body() createStationDto: CreateStationDto) {
    return await this.stationsService.create(createStationDto);
  }

  @Get()
  async findAll() {
    return await this.stationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.stationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return await this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stationsService.remove(id);
  }
}

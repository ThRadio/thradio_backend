import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
//Swagger
import { ApiTags } from '@nestjs/swagger';
//Services
import { StationsService } from './stations.service';
//Classes
import { StationClass } from './classes/station.class';
import { StatisticsClass } from './classes/statistics.class';
//Dto
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
//Guards
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { StationGuard } from 'src/utils/guards/station.guard';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @Post()
  async create(
    @Body() createStationDto: CreateStationDto,
  ): Promise<StationClass> {
    return await this.stationsService.create(createStationDto);
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @Get()
  async findAll(): Promise<StationClass[]> {
    return await this.stationsService.findAll();
  }

  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StationClass> {
    return await this.stationsService.findOne(id);
  }

  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ): Promise<StationClass> {
    return await this.stationsService.update(id, updateStationDto);
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stationsService.remove(id);
  }

  //Supervisor
  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Get('start/:id')
  async start(@Param('id') id: string) {
    await this.stationsService.start(id);
  }

  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Get('stop/:id')
  async stop(@Param('id') id: string) {
    await this.stationsService.stop(id);
  }

  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Get('restart/:id')
  async restart(@Param('id') id: string) {
    await this.stationsService.restart(id);
  }

  //Icecast
  @UseGuards(AuthGuard, StationGuard)
  @SetMetadata('roles', ['admin', 'station'])
  @Get('statistics/:id')
  async statistics(@Param('id') id: string): Promise<StatisticsClass> {
    return await this.stationsService.statistics(id);
  }
}

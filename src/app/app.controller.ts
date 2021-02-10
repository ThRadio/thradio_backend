import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
//Swagger
import { ApiTags } from '@nestjs/swagger';

//Services
import { AppService } from './app.service';
//Classes
import { CompletedClass } from './classes/completed.class';
//Dto
import { InitialDto } from './dto/initial.dto';
import { SetConfigDto } from './dto/set-config.dto';

//Guards
import { AuthGuard } from 'src/utils/guards/auth.guard';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('completed')
  async completedGet(): Promise<CompletedClass> {
    return await this.appService.completedGet();
  }

  @Post('initial')
  async initialConfig(@Body() initialDto: InitialDto): Promise<void> {
    return await this.appService.initialConfig(initialDto);
  }

  @Get('config')
  async getConfig() {
    return await this.appService.getConfig();
  }

  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin'])
  @Put('config')
  async updateConfig(@Body() configDto: SetConfigDto) {
    return await this.appService.setConfig(configDto);
  }
}

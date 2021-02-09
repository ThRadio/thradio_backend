import { Body, Controller, Get, Post } from '@nestjs/common';
//Swagger
import { ApiTags } from '@nestjs/swagger';
//Services
import { AppService } from './app.service';
//Classes
import { CompletedClass } from './classes/completed.class';
//Dto
import { InitialDto } from './dto/initial.dto';

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
}

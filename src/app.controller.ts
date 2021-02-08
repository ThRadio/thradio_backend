import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupervisorService } from './supervisor/supervisor.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supervisor: SupervisorService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

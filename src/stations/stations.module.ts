import { HttpModule, Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';

@Module({
  imports: [HttpModule],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}

import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';

@Module({
  controllers: [StationsController],
  providers: [StationsService]
})
export class StationsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StationsModule } from './stations/stations.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AppModule as AppConfig } from './app/app.module';

@Module({
  imports: [StationsModule, SupervisorModule, DbModule, UsersModule, AppConfig],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
//Services
import { DbService } from 'src/db/db.service';
import { UsersService } from 'src/users/users.service';
//Classes
import { CompletedClass } from './classes/completed.class';
import { ConfigClass } from './classes/config.class';
//Dto
import { InitialDto } from './dto/initial.dto';
import { SetConfigDto } from './dto/set-config.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DbService,
    private readonly usersService: UsersService,
  ) {}

  async completedGet() {
    let completed = await this.dbService
      .app()
      .findOne<CompletedClass>({ _id: 'completed' });
    if (completed) return completed;
    else {
      completed = await this.dbService.app().insert<CompletedClass>({
        user: false,
        config: false,
        _id: 'completed',
      });
      return completed;
    }
  }

  async setConfig(setConfigDto: SetConfigDto): Promise<void> {
    await this.dbService.app().insert<ConfigClass>(setConfigDto);
  }

  async initialConfig(initialDto: InitialDto): Promise<void> {
    await this.setConfig(initialDto.config);
    await this.usersService.create(initialDto.user);
  }
}

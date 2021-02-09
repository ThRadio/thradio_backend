import { Injectable } from '@nestjs/common';
//Services
import { DbService } from 'src/db/db.service';
import { SupervisorService } from 'src/supervisor/supervisor.service';
//Classes
import { StationClass } from './classes/station.class';
//Dto
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
//Libreries
import { create } from 'xmlbuilder2';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StationsService {
  constructor(
    private readonly dbService: DbService,
    private readonly supervisor: SupervisorService,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<StationClass> {
    const station = await this.dbService.stations().insert(createStationDto);
    // Station directory path
    const station_path = path.join(
      '/backend',
      'stations',
      `ThRadio_${station._id}`,
    );
    // Create station directory
    if (!fs.existsSync(station_path)) {
      fs.mkdirSync(station_path);
    }
    // Create icecast.xml file
    await this.createIcecast(station_path, {
      name: station.name,
      icecast_password: station.icecast_password,
      icecast_port: station.icecast_port,
    });
    // Create supervisord.conf file
    await this.createSupervisor(station_path, {
      _id: station._id,
    });
    // Reload supervisor config's files
    await this.supervisor.reloadSupervisor();
    return station;
  }

  async findAll(): Promise<StationClass[]> {
    return await this.dbService.stations().find({});
  }

  async findOne(id: string): Promise<StationClass> {
    return await this.dbService.stations().findOne({ _id: id });
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<StationClass> {
    const station_path = path.join('/backend', 'stations', `ThRadio_${id}`);
    await this.dbService
      .stations()
      .update<StationClass>({ _id: id }, updateStationDto);
    // Create icecast.xml file
    await this.createIcecast(station_path, {
      name: updateStationDto.name,
      icecast_password: updateStationDto.icecast_password,
      icecast_port: updateStationDto.icecast_port,
    });
    await this.supervisor.restartProcess(`ThRadio_${id}`);
    return await this.dbService.stations().findOne({ _id: id });
  }

  async remove(id: string): Promise<void> {
    const station_path = path.join('/backend', 'stations', `ThRadio_${id}`);
    //Remove station of db
    await this.dbService.stations().remove({ _id: id }, {});
    // Remove station folder
    if (fs.existsSync(station_path)) {
      fs.rmdirSync(station_path, { recursive: true });
    }
    // Reload supervisor
    await this.supervisor.reloadSupervisor();
  }

  createIcecast(
    station_path: string,
    station: {
      name: string;
      icecast_password: string;
      icecast_port: number;
    },
  ) {
    return new Promise<void>((resolve) => {
      const obj = {
        icecast: {
          location: 'ThRadio',
          limits: {
            clients: 250,
            sources: 1,
            'queue-size': 524288,
            'client-timeout': 30,
            'header-timeout': 15,
            'source-timeout': 10,
            'burst-size': 65535,
          },
          authentication: {
            'source-password': station.icecast_password,
            'admin-user': 'admin',
            'admin-password': station.icecast_password,
          },
          'listen-socket': {
            port: station.icecast_port,
          },
          mount: {
            '@type': 'normal',
            'mount-name': '/radio.mp3',
            charset: 'UTF8',
            'stream-name': station.name,
          },
          fileserve: 1,
          paths: {
            basedir: '/usr/local/share/icecast',
            webroot: '/usr/local/share/icecast/web',
            adminroot: '/usr/local/share/icecast/admin',
            'x-forwarded-for': '172.*.*.*',
          },
          security: {
            chroot: 0,
          },
        },
      };
      const xml = create().ele(obj);
      const string: string = xml.toString({ prettyPrint: true });
      fs.writeFile(path.join(station_path, 'icecast.xml'), string, (error) => {
        if (error) console.log(error);
      });
      resolve();
    });
  }

  createSupervisor(
    station_path: string,
    station: {
      _id: string;
    },
  ) {
    return new Promise<void>((resolve) => {
      const file =
        `[program:ThRadio_${station._id}]\n` +
        'user=thradio\n' +
        `command=/usr/local/bin/icecast -c /var/thradio/stations/ThRadio_${station._id}/icecast.xml`;
      fs.writeFile(
        path.join(station_path, 'supervisord.conf'),
        file,
        (error) => {
          if (error) console.log(error);
        },
      );
      resolve();
    });
  }
}

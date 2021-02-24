import { HttpService, Injectable } from '@nestjs/common';
//Services
import { DbService } from 'src/db/db.service';
import { SupervisorService } from 'src/supervisor/supervisor.service';
import { UsersService } from 'src/users/users.service';
//Classes
import { StationClass } from './classes/station.class';
import { StatisticsClass } from './classes/statistics.class';
//Dto
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
//Libreries
import { create } from 'xmlbuilder2';
import * as fs from 'fs';
import * as path from 'path';
import { UserClass } from 'src/users/classes/user.class';

@Injectable()
export class StationsService {
  constructor(
    private readonly dbService: DbService,
    private readonly supervisor: SupervisorService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<StationClass> {
    const { user, ...stationDto } = createStationDto;
    //Create station in db
    const station = await this.dbService
      .stations()
      .insert({ active: true, ...stationDto });
    //Create user in db
    if (user) {
      const userDb = await this.usersService.create({
        station: station._id,
        role: 'station',
        ...user,
      });
      await this.dbService
        .stations()
        .update({ _id: station._id }, { $set: { user: userDb._id } });
    }
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
      description: station.description,
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
    const { user, ...station } = await this.dbService
      .stations()
      .findOne({ _id: id });
    let userData: UserClass;
    if (user) {
      userData = await this.usersService.findById(user);
      delete userData.password;
    }
    const { state } = await this.supervisor.getProcessInfo(
      `ThRadio_${station._id}`,
    );
    return {
      state,
      user: userData,
      ...station,
    };
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<StationClass> {
    const station_path = path.join('/backend', 'stations', `ThRadio_${id}`);
    const { user, ...stationDto } = updateStationDto;
    //Update/create or remove user
    if (user) {
      let station = await this.dbService
        .stations()
        .findOne<StationClass>({ _id: id });
      //Update user
      if (station.user) {
        const userDb = await this.usersService.update(station.user, {
          station: id,
          role: 'station',
          ...user,
        });
        station = await this.dbService.stations().update<StationClass>(
          { _id: id },
          { $set: { user: userDb._id, ...stationDto } },
          {
            returnUpdatedDocs: true,
          },
        );
      } else {
        //Create user
        const userDb = await this.usersService.create({
          station: id,
          role: 'station',
          ...user,
        });
        station = await this.dbService.stations().update<StationClass>(
          { _id: id },
          { $set: { user: userDb._id, ...stationDto } },
          {
            returnUpdatedDocs: true,
          },
        );
      }
    } else {
      await this.dbService.stations().update<StationClass>(
        { _id: id },
        { $set: { user: null, ...stationDto } },
        {
          returnUpdatedDocs: true,
        },
      );
      await this.dbService.users().remove({ station: id }, {});
    }
    // Create icecast.xml file
    await this.createIcecast(station_path, updateStationDto);
    await this.supervisor.restartProcess(`ThRadio_${id}`);
    return await this.dbService.stations().findOne({ _id: id });
  }

  async remove(id: string): Promise<void> {
    const station_path = path.join('/backend', 'stations', `ThRadio_${id}`);
    //Remove station of db
    await this.dbService.stations().remove({ _id: id }, {});
    // Remove user of db
    await this.dbService.users().remove({ station: id }, {});
    // Remove station folder
    if (fs.existsSync(station_path)) {
      fs.rmdirSync(station_path, { recursive: true });
    }
    // Reload supervisor
    await this.supervisor.reloadSupervisor();
  }

  createIcecast(station_path: string, station: StationClass) {
    return new Promise<void>((resolve) => {
      const obj = {
        icecast: {
          location: 'ThRadio',
          limits: {
            clients: station.listeners || 250,
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
            'stream-description': station.description || '',
            'stream-url': '',
            genre: station.genre || '',
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

  //Supervisor
  async start(id: string) {
    await this.supervisor.startProcess(`ThRadio_${id}`);
  }
  async stop(id: string) {
    await this.supervisor.stopProcess(`ThRadio_${id}`);
  }
  async restart(id: string) {
    await this.supervisor.restartProcess(`ThRadio_${id}`);
  }

  //Icecast
  async statistics(id: string): Promise<StatisticsClass> {
    try {
      const { icecast_port } = await this.findOne(id);
      const { data } = await this.httpService
        .get(`http://stations:${icecast_port}/status-json.xsl`)
        .toPromise();
      return {
        listeners: data.icestats.source.listeners || 0,
        listeners_peak: data.icestats.source.listener_peak || 0,
      };
    } catch (error) {
      return {
        listeners: 0,
        listeners_peak: 0,
      };
    }
  }
}

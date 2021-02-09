import { Injectable } from '@nestjs/common';
import Datastore from 'nedb-promises';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Db = require('nedb-promises');
import * as path from 'path';

@Injectable()
export class DbService {
  private db: {
    stations: Datastore;
    users: Datastore;
    app: Datastore;
  } = {
    stations: Db.create(path.join('db', 'stations.dat')),
    users: Db.create(path.join('db', 'users.dat')),
    app: Db.create(path.join('db', 'app.dat')),
  };

  stations() {
    return this.db.stations;
  }

  users() {
    return this.db.users;
  }

  app() {
    return this.db.app;
  }
}

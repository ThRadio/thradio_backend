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
    tokens: Datastore;
  } = {
    stations: Db.create({
      filename: path.join('db', 'stations.dat'),
      autoload: true,
    }),
    users: Db.create({
      filename: path.join('db', 'users.dat'),
      autoload: true,
    }),
    app: Db.create({
      filename: path.join('db', 'app.dat'),
      autoload: true,
    }),
    tokens: Db.create({
      filename: path.join('db', 'tokens.dat'),
      autoload: true,
    }),
  };

  stations() {
    this.db.stations.persistence.compactDatafile();
    return this.db.stations;
  }

  users() {
    this.db.users.persistence.compactDatafile();
    return this.db.users;
  }

  app() {
    this.db.app.persistence.compactDatafile();
    return this.db.app;
  }

  tokens() {
    this.db.tokens.persistence.compactDatafile();
    return this.db.tokens;
  }
}

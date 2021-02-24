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
      timestampData: true,
    }),
    users: Db.create({
      filename: path.join('db', 'users.dat'),
      autoload: true,
      timestampData: true,
    }),
    app: Db.create({
      filename: path.join('db', 'app.dat'),
      autoload: true,
      timestampData: true,
    }),
    tokens: Db.create({
      filename: path.join('db', 'tokens.dat'),
      autoload: true,
      timestampData: true,
    }),
  };

  constructor() {
    //Stations index
    this.db.stations.ensureIndex({
      fieldName: 'user',
      unique: true,
      sparse: true,
    });
    this.db.stations.ensureIndex({
      fieldName: 'icecast_port',
      unique: true,
    });
    //Users index
    this.db.users.ensureIndex({
      fieldName: 'email',
      unique: true,
    });
    this.db.users.ensureIndex({
      fieldName: 'username',
      unique: true,
    });
    this.db.users.ensureIndex({
      fieldName: 'station',
      unique: true,
      sparse: true,
    });
  }

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

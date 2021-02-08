import { Injectable } from '@nestjs/common';
import Datastore from 'nedb-promises';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Db = require('nedb-promises');
import * as path from 'path';

@Injectable()
export class DbService {
  private db: {
    stations: Datastore;
  } = {
    stations: Db.create(path.join('db', 'stations.dat')),
  };

  constructor() {
    this.db.stations.persistence.setAutocompactionInterval(5000);
  }

  stations() {
    return this.db.stations;
  }
}

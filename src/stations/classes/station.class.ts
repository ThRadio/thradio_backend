import { UserClass } from 'src/users/classes/user.class';

export class StationClass {
  _id?: string;
  active?: boolean;
  name?: string;
  description?: string;
  icecast_password?: string;
  icecast_port?: number;
  genre?: string;
  listeners?: number;
  user?: string | UserClass;
  //Supervisor
  state?: number;
}

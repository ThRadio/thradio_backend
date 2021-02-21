import { Injectable } from '@nestjs/common';
//Services
import { DbService } from 'src/db/db.service';
//Classes
import { UserClass } from './classes/user.class';
//Dtop
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//Libreries
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userDto } = createUserDto;
    const salt = await bcrypt.genSalt();
    const user = await this.dbService.users().insert<UserClass>({
      password: await bcrypt.hash(password, salt),
      ...userDto,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string) {
    const user = await this.dbService
      .users()
      .findOne<UserClass>({ username: username });
    return user;
  }

  async findById(id: string) {
    const user = await this.dbService.users().findOne<UserClass>({ _id: id });
    return user;
  }

  async update(id: string | UserClass, updateUserDto: UpdateUserDto) {
    const { password, ...userDto } = updateUserDto;
    if (password) {
      const salt = await bcrypt.genSalt();
      const user = await this.dbService.users().update<UserClass>(
        { _id: id },
        {
          $set: {
            password: await bcrypt.hash(password, salt),
            ...userDto,
          },
        },
      );
      return user;
    } else {
      const user = await this.dbService.users().update<UserClass>(
        { _id: id },
        {
          $set: { userDto },
        },
      );
      return user;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

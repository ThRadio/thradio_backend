import { Controller } from '@nestjs/common';
//Swagger
import { ApiTags } from '@nestjs/swagger';
//Services
import { UsersService } from './users.service';
//Dto

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

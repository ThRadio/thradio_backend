import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SetConfigDto } from './set-config.dto';

export class InitialDto {
  @Type(() => SetConfigDto)
  @ValidateNested()
  config: SetConfigDto;
  @Type(() => CreateUserDto)
  @ValidateNested()
  user: CreateUserDto;
}

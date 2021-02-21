import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'station',
  'role',
  'password',
] as const) {
  @IsOptional()
  @IsString()
  password: string;
}

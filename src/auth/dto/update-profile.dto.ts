import { IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
}

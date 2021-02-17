import { IsString, IsEmail, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  role?: string;
  @IsString()
  @IsOptional()
  station?: string;
}

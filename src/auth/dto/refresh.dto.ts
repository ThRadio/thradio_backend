import { IsJWT } from 'class-validator';
export class RefreshDto {
  @IsJWT()
  refresh_token: string;
}

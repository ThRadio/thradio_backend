import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
//Services
import { AuthService } from './auth.service';
//Dto
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refreshAccessToken(refreshDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async user(@Request() req: any) {
    return await this.authService.profile(req.user.email);
  }

  @Post('logout')
  logout() {
    return true;
  }
}

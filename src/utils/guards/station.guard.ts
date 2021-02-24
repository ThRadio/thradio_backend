import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class StationGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    const result = await this.authService.verifyToken(
      request.headers.authorization,
    );
    console.log(result);
    if (result.station == request.params.id || result.role == 'admin') {
      return true;
    } else return false;
  }
}

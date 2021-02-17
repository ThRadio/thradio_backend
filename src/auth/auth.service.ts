import { Injectable, UnprocessableEntityException } from '@nestjs/common';
//Services
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { DbService } from 'src/db/db.service';
//Classes
import { UserClass } from 'src/users/classes/user.class';
//Dto
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
//Libreries
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
    private dbService: DbService,
  ) {}

  private async validateUser(
    username: string,
    pass: string,
  ): Promise<UserClass> {
    const user = await this.usersService.findOne(username);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = {
      username: user.username,
      email: user.email,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user),
    };
  }

  private async generateRefreshToken(user: UserClass) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + 60 * 60 * 24 * 30);
    const token = await this.dbService.tokens().insert({
      userId: user._id,
      is_revoked: false,
      expiration: expiration,
    });
    return this.jwtService.sign(
      {},
      {
        jwtid: token._id,
        subject: user._id,
        expiresIn: 60 * 60 * 24 * 30,
      },
    );
  }

  async refreshAccessToken(refreshDto: RefreshDto) {
    const payload = await this.verifyToken(refreshDto.refresh_token);
    const token = await this.dbService
      .tokens()
      .findOne<any>({ _id: payload.jti });
    if (token.is_revoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }
    const user = await this.dbService
      .users()
      .findOne<UserClass>({ _id: payload.sub });
    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        email: user.email,
        sub: user._id,
        role: user.role,
      }),
    };
  }

  async verifyToken(token: string) {
    return await this.jwtService.verify(token.replace('Bearer ', ''), {
      ignoreExpiration: false,
      secret: process.env.JWT_SECRET,
    });
  }

  async profile(username: string) {
    const user = await this.usersService.findOne(username);
    const { password, ...newUser } = user;
    return newUser;
  }
}

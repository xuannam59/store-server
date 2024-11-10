import { IUser } from '@/modules/users/users.inerface';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOneByUsername(username));
    if (user) {
      const isValidPassword = comparePasswordHelper(pass, user.password);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  // [POST] /auth/login
  async login(user: IUser) {
    const payload = { username: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload)
    return {
      access_token: access_token
    };
  }
}

import { IUser } from '@/modules/users/users.inerface';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { RegisterUser } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
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
    const payload = { email: user.email, _id: user._id };
    const access_token = this.jwtService.sign(payload)
    return {
      access_token: access_token
    };
  }

  // [POST] /auth/register
  async register(registerUser: RegisterUser) {
    const newUser = await this.usersService.register(registerUser);
    return {
      _id: newUser._id
    };
  }
}

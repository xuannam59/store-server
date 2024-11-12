import { IUser } from '@/modules/users/users.inerface';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { RegisterUser } from './dto/auth-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = (await this.usersService.findOneByEmail(username));
    if (user) {
      const isValidPassword = comparePasswordHelper(password, user.password);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  // [POST] /auth/login
  async login(user: IUser, res: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token access",
      iss: "from server",
      _id,
      name,
      email,
      role
    };

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.createRefreshToken(payload);

    await this.usersService.updateUserRefresh(refresh_token, _id);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // only the server can get it
      maxAge: ms(this.configService.get<string>("EXPIRE_COOKIES"))
    });

    return {
      access_token: access_token,
      user: {
        _id,
        name,
        email,
        role
      }
    };
  }

  // [POST] /auth/logout
  async logout(res: Response, user: IUser) {
    await this.usersService.updateUserRefresh("", user._id);
    res.clearCookie("refresh_token");
    return "Ok";
  }

  // [POST] /auth/register
  async register(registerUser: RegisterUser) {
    const newUser = await this.usersService.register(registerUser);
    return {
      _id: newUser._id
    };
  }

  // create refresh token
  createRefreshToken(payload): string {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
    });
    return refresh_token
  }

  // [GET] /auth/account
  async getAccount(user: IUser) {
    return user
  }

  // [GET] /auth/refresh-token
  async processRefreshToken(refreshToken: string, res: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      });
      const user = (await this.usersService.findUserByToken(refreshToken));

      if (!user)
        throw new BadRequestException("Refresh token không hợp lệ . Vui lòng login lại");

      const { _id, name, email, role } = user
      const payload = {
        subject: "",
        iss: "",
        _id,
        name,
        email,
        role
      };
      const access_token = this.jwtService.sign(payload);

      const refresh_token = this.createRefreshToken(payload);

      await this.usersService.updateUserRefresh(refresh_token, _id.toString());
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true, // only the server can get it
        maxAge: ms(this.configService.get<string>("EXPIRE_COOKIES"))
      });

      return {
        access_token,
        user: {
          _id,
          name,
          email,
          role
        }
      }

    } catch (error) {
      throw new BadRequestException("Refresh token không hợp lệ . Vui lòng login lại")
    }
  }
}

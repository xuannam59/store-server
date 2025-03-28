import { IUser } from '@/modules/users/users.interface';
import { UsersService } from '@/modules/users/users.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/helpers/util';
import { ChangePassword, ConfirmCode, CreateForgotPassword, RegisterUser, ResetPassword } from './dto/auth-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from '@/modules/roles/roles.service';
import { CartsService } from '@/modules/carts/carts.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
    private cartService: CartsService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = (await this.usersService.findOneByEmail(username));
    if (user) {
      const userRole = user.role as unknown as { _id: string, title: string }
      const term = await this.roleService.findOne(userRole._id);

      const isValidPassword = comparePasswordHelper(password, user.password);
      if (isValidPassword) {

        const objectUser = {
          ...user.toObject(),
          permissions: term?.permissions ?? []
        }

        return objectUser;
      }
    }
    return null;
  }

  // [POST] /auth/login
  async login(user: IUser, res: Response, cartId: string) {
    const { _id, name, email, role, avatar, phone, gender, age } = user;
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

    const userRole = user.role as unknown as { _id: string, title: string }
    const [_, term] = await Promise.all([
      this.usersService.updateUserRefresh(refresh_token, _id),
      this.roleService.findOne(userRole._id)
    ]);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, // only the server can get it
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
    });

    await this.cartService.checkAccountCart(_id, cartId, res);

    return {
      access_token: access_token,
      user: {
        _id,
        name,
        email,
        phone,
        age,
        gender,
        role,
        avatar,
        permissions: term?.permissions ?? []
      }
    };
  }

  // [POST] /auth/logout
  async logout(res: Response, user: IUser) {
    await this.usersService.updateUserRefresh("", user._id);
    res.clearCookie("refresh_token");
    res.clearCookie("cart_id");
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
  async getAccount(user: IUser, res: Response) {
    const { _id, name, email, role, avatar, phone, age, gender } = user;
    const userRole = user.role as unknown as { _id: string, title: string };
    const term = await this.roleService.findOne(userRole._id);

    return {
      _id,
      name,
      email,
      phone,
      age,
      gender,
      role,
      avatar,
      permissions: term?.permissions ?? []
    }
  }

  // [GET] /auth/refresh-token
  async processRefreshToken(refreshToken: string, res: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      });
      const user = await this.usersService.findUserByToken(refreshToken);
      if (!user)
        throw new BadRequestException("Refresh token không hợp lệ . Vui lòng login lại");

      const { _id, name, email, role, avatar } = user
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

      const userRole = user.role as unknown as { _id: string, title: string }
      const term = await this.roleService.findOne(userRole._id);

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true, // only the server can get it
        maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
      });
      await this.usersService.updateUserRefresh(refresh_token, _id.toString());

      const cartId = await this.cartService.findOne(_id.toString());
      res.cookie("cart_id", cartId, {
        httpOnly: true, // only the server can get it
        maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
      });

      return {
        access_token,
        user: {
          _id,
          name,
          email,
          role,
          avatar,
          permissions: term?.permissions ?? []
        }
      }

    } catch (error) {
      throw new BadRequestException("Refresh token không hợp lệ . Vui lòng login lại")
    }
  }

  // [POST] /auth/forgot-password
  async handleForgotPassword(data: CreateForgotPassword) {
    const { email } = data;
    const result = await this.usersService.forgotPassword(email);
    return result;
  }

  // [POST] /auth/confirm-code
  async handleConfirmCode(data: ConfirmCode) {
    const { email, otp } = data
    const result = await this.usersService.confirmCode(email, otp);
    return {
      email: result.email
    }
  }

  // [POST] /auth/reset-password
  async handleResetPassword(data: ResetPassword) {
    const { email, password, confirmPassword, otp } = data;
    const result = await this.usersService.resetPassword(email, otp, password, confirmPassword);
    return result;
  }

  // [Path] /auth/change-password
  async handleChangePassword(user: IUser, data: ChangePassword) {
    const { oldPassword, newPassword, confirmPassword } = data;
    const result = await this.usersService.ChangePassword(user, oldPassword, newPassword, confirmPassword);
    return result;
  }
}

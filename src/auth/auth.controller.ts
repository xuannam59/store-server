import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { ChangePassword, ConfirmCode, CreateForgotPassword, RegisterUser, ResetPassword } from './dto/auth-user.dto';
import { Request, Response } from 'express';
import { IUser } from '@/modules/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // [POST]/auth/register
  @Public()
  @ResponseMessage("Register user")
  @Post('register')
  handelRegister(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }

  // [POST]/auth/login
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Login user")
  @Post('login')
  handelLogin(
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    const cartId = req.cookies["cart_id"]
    return this.authService.login(req.user, res, cartId);
  }

  // [POST] /auth/logout
  @ResponseMessage("Logout user")
  @Post('logout')
  handelLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(res, user);
  }

  // [GET] /auth/account
  @ResponseMessage("Get account")
  @Get('account')
  getAccount(
    @User() user: IUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.getAccount(user, res)
  }

  // [GET] /auth/refresh-token
  @Public()
  @ResponseMessage("")
  @Post('refresh-token')
  processRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.authService.processRefreshToken(refreshToken, res);
  }

  // [POST] /auth/forgot-password
  @Public()
  @ResponseMessage("Generate otp code")
  @Post('forgot-password')
  handleForgotPassword(@Body() data: CreateForgotPassword) {
    return this.authService.handleForgotPassword(data);
  }

  //[POST] /auth/confirm-code
  @Public()
  @ResponseMessage("confirm otp code")
  @Post('confirm-code')
  handleConfirmCode(@Body() data: ConfirmCode) {
    return this.authService.handleConfirmCode(data);
  }

  //[POST] /auth/reset-password
  @Public()
  @ResponseMessage("Reset Password")
  @Post('reset-password')
  handleResetPassword(@Body() data: ResetPassword) {
    return this.authService.handleResetPassword(data);
  }

  //[patch] /auth/change-password
  @ResponseMessage("Change password")
  @Patch("change-password")
  handleChangePassword(
    @User() user: IUser,
    @Body() data: ChangePassword
  ) {
    return this.authService.handleChangePassword(user, data)
  }
}

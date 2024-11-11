import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from '@/decorators/customize';
import { RegisterUser } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // [POST]/auth/login
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Login user")
  @Post('login')
  handelLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // [POST]/auth/register
  @Public()
  @ResponseMessage("Register user")
  @Post('register')
  handelRegister(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }
}

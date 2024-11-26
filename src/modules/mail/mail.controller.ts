import { Body, Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '@/decorators/customize';
import { ISendOTP } from './mail.interface';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
  ) { }

  @Public()
  @Get("otp")
  @ResponseMessage("Test email")
  handleSendOtp(@Body() data: ISendOTP) {
    return this.mailService.sendOTP(data)
  }
}

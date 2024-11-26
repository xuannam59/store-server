import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ISendOTP } from './mail.interface';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendOTP(data: ISendOTP) {
        try {
            await this.mailerService.sendMail({
                to: data.email,
                from: 'lmxn.congviec@gmail.com', // override default from
                subject: `Mã OTP: ${data.otp}`,
                template: "send-otp",
                context: {
                    otp: data.otp,
                    email: data.email
                }
            });

            return "Send mail Success"
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

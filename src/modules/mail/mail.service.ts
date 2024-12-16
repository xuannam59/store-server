import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ISendOTP } from './mail.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendOTP(data: ISendOTP) {
        try {
            await this.mailerService.sendMail({
                to: data.email,
                from: this.configService.get<string>("EMAIL_AUTH_USER"), // override default from
                subject: data.subject,
                template: data.template,
                context: {
                    otp: data.otp,
                    email: data.email,
                    name: data.name ?? "bạn"
                }
            });

            return "Send mail Success"
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

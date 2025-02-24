import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessorService } from './mail.processor';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"),
          auth: {
            user: configService.get<string>("EMAIL_AUTH_USER"),
            pass: configService.get<string>("EMAIL_AUTH_PASS"),
          },
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: "mail-queue",
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        }
      }
    })
  ],
  providers: [MailService, MailProcessorService],
  exports: [MailService]
})
export class MailModule { }

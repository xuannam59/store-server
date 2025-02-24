import { Injectable } from '@nestjs/common';
import { ISendMail } from './mail.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue("mail-queue") private mailQueue: Queue,
    ) { }

    async sendMail(infoMail: ISendMail) {
        await this.mailQueue.add("send-mail",
            { infoMail },
            {
                removeOnComplete: true,
                removeOnFail: true
            }
        );
        console.log(`Email queued for ${infoMail.email}`);
    }
}
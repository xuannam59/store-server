import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import { Job, tryCatch } from "bullmq";
import { ISendMail } from "./mail.interface";

@Processor("mail-queue")
export class MailProcessorService extends WorkerHost {
    constructor(
        private mailerService: MailerService,
        private configService: ConfigService
    ) {
        super();
    }

    async process(job: Job<{ infoMail: ISendMail }>): Promise<void> {
        const { infoMail } = job.data;
        try {
            await this.mailerService.sendMail({
                to: infoMail.email,
                from: this.configService.get<string>("EMAIL_AUTH_USER"),
                subject: infoMail.subject,
                template: infoMail.template,
                context: {
                    data: infoMail.data,
                    email: infoMail.email,
                    name: infoMail.name ?? "bạn"
                }
            });
            console.log(`Email sent to ${infoMail.email}`);
        }
        catch (error) {
            console.error(`Failed to send email to ${infoMail.email}:`, error.message);
            throw error; // Ném lỗi để BullMQ đánh dấu job thất bại và retry
        }
    }
}
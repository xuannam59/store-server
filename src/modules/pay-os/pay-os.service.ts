import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS from '@payos/node';
import { CreatePayOSDto } from './dto/create-pay-os.dto';

@Injectable()
export class PayOsService {
    private payOS: PayOS;

    constructor(private configService: ConfigService) {
        this.payOS = new PayOS(
            configService.get<string>("PAYOS_APP_ID"),
            configService.get<string>("PAYOS_API_KEY"),
            configService.get<string>("PAYOS_CHECKSUM_KEY")
        );
    }

    async createPaymentLink(createPayOSDto: CreatePayOSDto) {
        const { amount, description, returnUrl, cancelUrl, items } = createPayOSDto
        const body = {
            orderCode: Number(String(new Date().getTime()).slice(-6)),
            amount,
            description,
            items,
            returnUrl,
            cancelUrl
        }
        try {
            const paymentLinkRes = await this.payOS.createPaymentLink(body);

            return {
                bin: paymentLinkRes.bin,
                checkoutUrl: paymentLinkRes.checkoutUrl,
                accountNumber: paymentLinkRes.accountNumber,
                accountName: paymentLinkRes.accountName,
                amount: paymentLinkRes.amount,
                description: paymentLinkRes.description,
                orderCode: paymentLinkRes.orderCode,
                qrCode: paymentLinkRes.qrCode,
            }

        } catch (error) {
            console.log(error);
            throw new BadRequestException("Payment failed");
        }
    }

    async getPaymentLinkInformation(paymentId: number) {
        try {
            const order = await this.payOS.getPaymentLinkInformation(paymentId);
            if (!order) {
                throw new BadRequestException("Get information failed");
            }
            return order;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Get information failed");
        }
    }

}

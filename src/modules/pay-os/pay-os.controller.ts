import { Body, Controller, Param, Post, Put, Query } from '@nestjs/common';
import { PayOsService } from './pay-os.service';
import { Public } from '@/decorators/customize';
import { CreatePayOSDto } from './dto/create-pay-os.dto';

@Controller('pay-os')
export class PayOsController {
  constructor(private readonly payOsService: PayOsService) { }

  @Public()
  @Post("create")
  createPayment(
    @Body() createPayOSDto: CreatePayOSDto,
  ) {
    return this.payOsService.createPaymentLink(createPayOSDto);
  }

  @Put(":paymentId")
  getPayment(
    @Param("paymentId") paymentId: string
  ) {
    return this.payOsService.getPaymentLinkInformation(+paymentId);
  }
}

import { Module } from '@nestjs/common';
import { PayOsService } from './pay-os.service';
import { PayOsController } from './pay-os.controller';

@Module({
  controllers: [PayOsController],
  providers: [PayOsService],
})
export class PayOsModule {}

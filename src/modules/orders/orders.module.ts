import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Cart, CartSchema } from '../carts/schemas/cart.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: Cart.name, schema: CartSchema }
  ]),
    MailModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }

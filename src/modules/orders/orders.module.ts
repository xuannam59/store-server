import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Cart, CartSchema } from '../carts/schemas/cart.schema';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: Cart.name, schema: CartSchema },
    { name: Product.name, schema: ProductSchema }
  ]),
    MailModule,
    NotificationsModule,
    ReviewsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }

import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { UserAddress, UserAddressSchema } from './schemas/user-address.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema },
    { name: Product.name, schema: ProductSchema },
    { name: UserAddress.name, schema: UserAddressSchema }
  ])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule { }

import { Module } from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { DiscussController } from './discuss.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discuss, DiscussSchema } from './schemas/discuss.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Discuss.name, schema: DiscussSchema },
    { name: Product.name, schema: ProductSchema }
  ])],
  controllers: [DiscussController],
  providers: [DiscussService],
})
export class DiscussModule { }

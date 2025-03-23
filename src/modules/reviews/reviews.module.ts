import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Review.name, schema: ReviewSchema },
    { name: Product.name, schema: ProductSchema }
  ])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }

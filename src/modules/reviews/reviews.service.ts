import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModule: Model<Review>) { }

  async create(createReviewDto: CreateReviewDto, user: IUser) {
    const { comment, product_id, star,
      parent_id, images } = createReviewDto

    const result = await this.reviewModule.create({
      comment, product_id, star,
      parent_id, images,
      created_by: user._id
    });

    return result;
  }

  findAll(current: number, limit: number, productId: string, qs: string) {
    const { filter } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    delete filter.productId;

    console.log(filter);
    return `This action returns all reviews`;
  }


  update(id: string, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string, user: IUser) {
    return `This action removes a #${id} review`;
  }
}

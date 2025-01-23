import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModule: Model<Review>,
    @InjectModel(Product.name) private productModule: Model<Product>,
  ) { }

  async createReview(createReviewDto: CreateReviewDto, user: IUser) {
    const { comment, product_id, star, images } = createReviewDto

    const result = await this.reviewModule.create({
      comment, product_id, star, images,
      created_by: user._id
    });

    const reviews = await this.reviewModule.find({
      product_id,
      isDeleted: false
    });

    const numberOfReview = reviews.length

    const reviewScore = numberOfReview > 0
      ? parseFloat((reviews.reduce((previousValue, currentValue) =>
        currentValue.star + previousValue, 0) / numberOfReview).toFixed(2))
      : 0;

    await this.productModule.updateOne({
      _id: product_id
    }, {
      reviews: {
        score: reviewScore,
        numberOf: numberOfReview
      }
    })



    return { _id: result._id };
  }

  async findAllReviews(current: number, pageSize: number, productId: string, qs: string) {
    const { filter } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    delete filter.id;
    filter.isDeleted = false

    const reviews = await this.reviewModule.find({
      product_id: productId,
      isDeleted: false
    });
    const totalReviews = reviews.length
    const reviewScore = totalReviews > 0
      ? parseFloat((reviews.reduce((previousValue, currentValue) =>
        currentValue.star + previousValue, 0) / totalReviews).toFixed(2))
      : 0;

    const defaultCurrent = current ? current : 1;
    const defaultPagesize = pageSize ? pageSize : 5;

    const pages = Math.ceil(totalReviews / defaultPagesize);
    const skip = (defaultCurrent - 1) * defaultPagesize;

    const result = await this.reviewModule.find(filter)
      .skip(skip)
      .limit(defaultPagesize)
      .sort({ createdAt: "desc" })
      .populate({ path: "created_by", select: "name avatar" })

    return {
      meta: {
        reviewScore,
        current: defaultCurrent,
        pageSize: defaultPagesize,
        pages,
        totalItems: totalReviews
      },
      result
    };
  }


  update(id: string, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string, user: IUser) {
    return `This action removes a #${id} review`;
  }
}

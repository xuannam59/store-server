import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) { }

  async createReview(createReviewDto: CreateReviewDto, orderId: string, user: IUser) {
    const { comment, product_id, star, images } = createReviewDto

    if (!mongoose.Types.ObjectId.isValid(orderId))
      throw new BadRequestException("OrderId is invalid");

    const updateResult = await this.orderModel.updateOne(
      {
        _id: orderId,
        "products._id": product_id
      },
      {
        $set: {
          "products.$.review": true
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new NotFoundException("Order or product not found");
    }

    await this.reviewModel.create({
      comment, product_id, star, images,
      created_by: user._id
    });

    const reviews = await this.reviewModel.find({
      product_id,
      isDeleted: false
    });

    const numberOfReview = reviews.length

    const reviewScore = numberOfReview > 0
      ? parseFloat((reviews.reduce((previousValue, currentValue) =>
        currentValue.star + previousValue, 0) / numberOfReview).toFixed(2))
      : 0;

    await this.productModel.updateOne({
      _id: product_id
    }, {
      reviews: {
        score: reviewScore,
        numberOf: numberOfReview
      }
    })

    return "Successful review";
  }

  async findAllReviews(current: number, pageSize: number, productId: string, qs: string) {
    const { filter } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false

    const reviews = await this.reviewModel.find({
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

    const result = await this.reviewModel.find(filter)
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

  async changeLike(reviewId: string, userId: string) {
    const existUserId = await this.reviewModel.findOne({
      _id: reviewId,
      like: userId
    });

    (existUserId ?
      await this.reviewModel.updateOne({
        _id: reviewId,
        like: userId
      }, {
        $pull: {
          like: userId
        }
      })
      :
      await this.reviewModel.updateOne({
        _id: reviewId
      }, {
        $push: {
          like: userId
        }
      })
    )

    return "Change Success"
  }

}

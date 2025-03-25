import { Public, ResponseMessage, User } from '@/decorators/customize';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IUser } from '../users/users.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post("/:orderId")
  @ResponseMessage("Create review")
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IUser,
    @Param("orderId") orderId: string
  ) {
    return this.reviewsService.createReview(createReviewDto, orderId, user);
  }

  @Public()
  @ResponseMessage("Fetch reviews")
  @Get()
  findAllReview(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query("product_id") productId: string,
    @Query() qs: string
  ) {
    return this.reviewsService.findAllReviews(+current, +pageSize, productId, qs);
  }

  @ResponseMessage("Fetch reviews")
  @Patch("change-like/:id")
  changeButtonLike(
    @Param("id") reviewId: string,
    @User() user: IUser
  ) {
    return this.reviewsService.changeLike(reviewId, user._id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @ResponseMessage("Create review")
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IUser
  ) {
    return this.reviewsService.createReview(createReviewDto, user);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.reviewsService.remove(id, user);
  }
}

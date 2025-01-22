import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IUser
  ) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query("id") productId: string,
    @Query() qs: string
  ) {
    return this.reviewsService.findAll(+currentPage, +limit, productId, qs);
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

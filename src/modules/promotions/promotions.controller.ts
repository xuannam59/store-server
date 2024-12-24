import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) { }

  @ResponseMessage("Create create new promotion")
  @Post()
  create(
    @Body() createPromotionDto: CreatePromotionDto,
    @User() user: IUser
  ) {
    return this.promotionsService.create(createPromotionDto, user);
  }

  @Get()
  @ResponseMessage("Fetch promotions with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return this.promotionsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch a promotion by id")
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update promotion")
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @User() user: IUser
  ) {
    return this.promotionsService.update(id, updatePromotionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete promotion")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.promotionsService.remove(id, user);
  }
}
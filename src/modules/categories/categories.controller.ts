import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IUser } from '../users/users.inerface';
import { ResponseMessage, User } from '@/decorators/customize';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ResponseMessage("Create a new category")
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: IUser
  ) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage("Fetch categories with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return this.categoriesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("fetch a category by id")
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update a category")
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete a category")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.categoriesService.remove(id, user);
  }
}

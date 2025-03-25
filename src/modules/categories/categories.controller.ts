import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IUser } from '../users/users.interface';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { PermissionGuard } from '@/guards/permission.guards';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  //[POST] api/v1/categories
  @UseGuards(PermissionGuard)
  @Post()
  @ResponseMessage("Create a new category")
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() user: IUser
  ) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch categories with pagination")
  findAll(
    @Query() qs: string
  ) {
    return this.categoriesService.findAll(qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("fetch a category by id")
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  //[PATCH] api/v1/categories/:id
  @UseGuards(PermissionGuard)
  @Patch(':id')
  @ResponseMessage("update a category")
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser) {
    return this.categoriesService.update(id, updateCategoryDto, user);
  }

  //[DELETE] api/v1/categories/:id
  @UseGuards(PermissionGuard)
  @Delete(':id')
  @ResponseMessage("delete a category")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.categoriesService.remove(id, user);
  }
}

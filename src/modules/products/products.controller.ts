import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.inerface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ResponseMessage("Create a new product")
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: IUser
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ResponseMessage("Fetch products with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return this.productsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch a product by id")
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a product")
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete a product")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.productsService.remove(id, user);
  }
}

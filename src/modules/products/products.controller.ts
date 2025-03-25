import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';
import { PermissionGuard } from '@/guards/permission.guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //[POST] api/v1/products
  @UseGuards(PermissionGuard)
  @Post()
  @ResponseMessage("Create a new product")
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: IUser
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Public()
  @Get("get-related/:slug")
  @ResponseMessage("")
  getRelatedProducts(
    @Param("slug") slug: string
  ) {
    return this.productsService.getRelatedProducts(slug);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch products with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() query
  ) {
    return this.productsService.findAll(+current, +pageSize, query);
  }

  @Get("/top-selling")
  GetTopSellingAndLowQuantity() {
    return this.productsService.getTopSellingAndLowQuantity();
  }

  @Public()
  @Get(':idOrSlug')
  @ResponseMessage("Fetch a product by slug")
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  //[PATCH] api/v1/products/:id
  @UseGuards(PermissionGuard)
  @Patch(':id')
  @ResponseMessage("Update a product")
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  //[DELETE] api/v1/products/:id
  @UseGuards(PermissionGuard)
  @Delete("delete-multiple")
  @ResponseMessage("Delete multiple products")
  removeMultiple(
    @Body() ids: string[],
    @User() user: IUser
  ) {
    return this.productsService.removeMultiple(ids, user);
  }

  //[DELETE] api/v1/products/:id
  @UseGuards(PermissionGuard)
  @Delete(':id')
  @ResponseMessage("delete a product")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.productsService.remove(id, user);
  }
}

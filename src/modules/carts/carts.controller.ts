import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { Request, Response } from 'express';
import { IUser } from '../users/users.interface';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Public()
  @ResponseMessage("Get a cart")
  @Post()
  getCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() data: { userId: string }
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.getCart(cartId, res, data.userId);
  }

  @Public()
  @ResponseMessage("add product")
  @Patch("add-product")
  addProduct(
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request
  ) {
    const id = req.cookies["cart_id"];
    return this.cartsService.addProduct(id, updateCartDto)
  }

  @Public()
  @ResponseMessage("remove product")
  @Delete('remove-product')
  removeProduct(
    @Query('id') id: string,
    @Query('color') color: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.removeProduct(cartId, id, color);
  }
}

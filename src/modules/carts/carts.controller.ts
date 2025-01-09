import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const { productList } = updateCartDto
    console.log(productList.productId);
    return this.cartsService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}

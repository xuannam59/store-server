import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { Request, Response } from 'express';
import { IUser } from '../users/users.interface';
import { CreateUserAddressDto } from './dto/create-user-address';

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
  @Patch('remove-product')
  removeProduct(
    @Body('id') id: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.removeProduct(cartId, id);
  }

  @Public()
  @ResponseMessage("change product type")
  @Patch("change-product-type")
  changeProductType(
    @Body("_id") _id: string,
    @Body("value") value: number | string,
    @Body("type") type: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.changProductType(cartId, _id, value, type);
  }

  @Public()
  @ResponseMessage("")
  @Post("add-user-address")
  addNewAddress(
    @Body() createUserAddress: CreateUserAddressDto,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.addUserAddress(cartId, createUserAddress);
  }
}

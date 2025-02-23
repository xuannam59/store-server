import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Public, ResponseMessage } from '@/decorators/customize';
import { Request, Response } from 'express';
import { CreateUserAddressDto } from './dto/create-user-address';
import { UpdateUserAddressDto } from './dto/update-user-address';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Public()
  @ResponseMessage("Get a cart")
  @Post()
  getCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body("userId") userId: string
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.getCart(cartId, res, userId);
  }

  @Public()
  @ResponseMessage("add product")
  @Patch("add-product")
  addProduct(
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.addProduct(cartId, updateCartDto)
  }

  @Public()
  @ResponseMessage("remove product")
  @Patch('remove-product')
  removeProduct(
    @Body('id') productId: string,
    @Body('color') color: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.removeProduct(cartId, productId, color);
  }

  @Public()
  @ResponseMessage("change product type")
  @Patch("change-product-type")
  changeProductType(
    @Body("_id") productId: string,
    @Body("value") value: number | string,
    @Body("type") type: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.changProductType(cartId, productId, value, type);
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

  @Public()
  @ResponseMessage("")
  @Delete("delete-user-address/:id")
  deleteAddress(
    @Param("id") addressId: string,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.deleteUserAddress(cartId, addressId);
  }

  @Public()
  @ResponseMessage("")
  @Patch("edit-user-address/:id")
  editAddress(
    @Param("id") addressId: string,
    @Body() updateUserAddress: UpdateUserAddressDto,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"];
    return this.cartsService.updateUserAddress(cartId, addressId, updateUserAddress);
  }
}

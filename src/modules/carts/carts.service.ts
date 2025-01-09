import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private configService: ConfigService

  ) { }

  async getCart(cartId: string, res: Response, userId: string) {
    const cart = await this.cartModel.findOne({
      $or: [
        {
          _id: cartId,
        },
        {
          userId: userId ? new mongoose.Types.ObjectId(userId) : undefined
        }
      ],
    })
      .populate({
        path: "productList.productId",
        select: "title price image",
      });
    if (!cart) {
      const newCart = await this.cartModel.create({});

      res.cookie("cart_id",
        newCart._id, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
      });
      return newCart;
    }
    res.cookie("cart_id",
      cart._id, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
    });
    return cart;
  }

  async checkAccountCart(userId: string, cartId: string, res: Response) {
    const userCart = await this.cartModel.findOne({
      userId: userId,
    });

    if (!userCart) {
      await this.cartModel.updateOne({
        _id: cartId
      }, {
        userId: userId
      });
      return;
    }
    await this.cartModel.deleteOne({
      _id: cartId,
    })

    res.cookie("cart_id", userCart._id, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
    });
    return;
  }

  async findOne(id: string) {
    const userCart = await this.cartModel.findOne({
      userId: id
    });

    return userCart._id;
  }

  update(id: string, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}

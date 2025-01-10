import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private configService: ConfigService

  ) { }

  async getCart(cartId: string, res: Response, userId: string) {
    const cart = await this.cartModel.findOne({
      $or: [
        {
          _id: cartId,
        },
        {
          userId: userId ? new Types.ObjectId(userId) : undefined
        }
      ],
    })
      .populate({
        path: "productList.productId",
        select: "title price categoryId discountPercentage images versions slug",
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
      userId: { $exists: false }
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

  async addProduct(id: string, updateCartDto: UpdateCartDto) {
    const { productId, quantity, color } = updateCartDto;

    const [cart, product] = await Promise.all([
      this.cartModel.findOne({ _id: id }),
      this.productModel.findById(productId)
    ]);

    if (!cart || !product) {
      throw new BadRequestException("Cart or Product not found");
    }

    const quantityProduct = product.versions.find(item => item.color === color).quantity;

    const productExist = cart.productList.find(item =>
      item.productId.toString() === productId
      && item.color === color);
    if (quantityProduct <= 0) {
      throw new BadRequestException("this product is out of stock")
    }
    if (productExist) {
      const newQuantity = Math.min(productExist.quantity + quantity, quantityProduct);
      if (newQuantity !== productExist.quantity) {
        await this.cartModel.updateOne({
          _id: id,
          "productList.productId": productId
        }, {
          $set: {
            "productList.$.quantity": newQuantity
          }
        });
        if (newQuantity === quantityProduct) {
          throw new BadRequestException("You have added maximum products");
        }
      }
    } else {
      if (quantityProduct > 0) {
        await this.cartModel.updateOne({
          _id: id
        }, {
          $push: {
            "productList": {
              $each: [{
                productId: productId,
                quantity: Math.min(quantity, quantityProduct),
                color: color
              }],
              $position: 0
            }
          }
        })
      }
    }
    return "Added product to cart successfully"
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}

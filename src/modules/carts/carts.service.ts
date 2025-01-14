import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import mongoose, { Model, Types } from 'mongoose';
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

  async addProduct(cartId: string, updateCartDto: UpdateCartDto) {
    const { productId, quantity, color } = updateCartDto;

    const [cart, product] = await Promise.all([
      this.cartModel.findOne({ _id: cartId }),
      this.productModel.findById(productId)
    ]);

    if (!cart || !product) {
      throw new BadRequestException("Cart or Product not found");
    }

    const productQuantity = product.versions.find(item => item.color === color).quantity;

    const productExist = cart.productList.find(item =>
      item.productId.toString() === productId
      && item.color === color);
    if (productQuantity <= 0) {
      throw new BadRequestException("this product is out of stock")
    }
    if (productExist) {
      const newQuantity = Math.min(productExist.quantity + quantity, productQuantity);
      const result = await this.cartModel.findOneAndUpdate({
        _id: cartId,
        "productList.productId": productId
      },
        { $set: { "productList.$.quantity": newQuantity } },
        { new: true }).populate({
          path: "productList.productId",
          select: "title price categoryId discountPercentage images versions slug",
        });
      return result;
    } else {
      if (productQuantity > 0) {
        const result = await this.cartModel.findOneAndUpdate(
          { _id: cartId },
          {
            $push: {
              "productList": {
                $each: [{
                  productId: productId,
                  quantity: Math.min(quantity, productQuantity),
                  color: color
                }],
                $position: 0
              }
            }
          },
          { new: true }).populate(
            {
              path: "productList.productId",
              select: "title price categoryId discountPercentage images versions slug",
            });
        return result
      }
    }
  }

  async removeProduct(cartId: string, productId: string) {
    if (!Types.ObjectId.isValid(productId))
      throw new BadRequestException("Product id is incorrect!");

    const productExist = await this.cartModel.findOne({
      _id: cartId,
      "productList._id": productId,
    });

    if (!productExist) {
      throw new NotFoundException("Product not found in cart!");
    }

    await this.cartModel.updateOne(
      { _id: cartId },
      { $pull: { productList: { _id: productId } } }
    );

    const result = await this.cartModel.findOne({ _id: cartId })
      .populate({
        path: "productList.productId",
        select: "title price categoryId discountPercentage images versions slug",
      });
    return result;
  }

  async changProductType(cartId: string, productId: string, value: number | string, type: string) {
    const updateField = type === "quantity" ? "productList.$.quantity" : "productList.$.color";

    const cartUser = await this.cartModel.findOneAndUpdate(
      { _id: cartId, "productList._id": productId },
      { $set: { [updateField]: value } },
      { new: true }
    ).populate({
      path: "productList.productId",
      select: "title price categoryId discountPercentage images versions slug",
    });

    return cartUser;
  }
}

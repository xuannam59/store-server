import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Product } from '../products/schemas/product.schema';
import { CreateUserAddressDto } from './dto/create-user-address';
import { UserAddress } from './schemas/user-address.schema';
import { UpdateUserAddressDto } from './dto/update-user-address';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddress>,
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
    }).populate([{ path: "productList.productId" }]);
    if (!cart) {
      const newCart = await this.cartModel.create({});

      res.cookie("cart_id",
        newCart._id, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
      });
      return newCart;
    }
    const userAddress = await this.userAddressModel.find({ cartId: cart._id });
    res.cookie("cart_id",
      cart._id, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("CART_EXPIRE"))
    });
    return {
      ...cart.toObject(),
      userAddress
    };
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

      await this.cartModel.updateOne({
        _id: cartId,
        "productList.productId": productId
      },
        { $set: { "productList.$.quantity": newQuantity } });
    } else {
      if (productQuantity > 0) {
        await this.cartModel.findOneAndUpdate(
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
          });
      }
    }
    return "Add product successfully";
  }

  async removeProduct(cartId: string, productId: string, color: string) {
    if (!Types.ObjectId.isValid(productId))
      throw new BadRequestException("Product id is incorrect!");

    const productExist = await this.cartModel.findOne({
      _id: cartId,
      "productList.productId": productId,
    });

    if (!productExist) {
      throw new NotFoundException("Product not found in cart!");
    }

    await this.cartModel.updateOne(
      { _id: cartId },
      { $pull: { productList: { productId, color } } }
    );

    return "Remove product successfully";
  }

  async changProductType(cartId: string, productId: string, value: number | string, type: string) {
    const updateField = type === "quantity" ? "productList.$.quantity" : "productList.$.color";

    await this.cartModel.updateOne(
      { _id: cartId, "productList.productId": productId },
      { $set: { [updateField]: value } }
    );

    return "Change successfully";
  }

  async addUserAddress(cartId: string, createUserAddress: CreateUserAddressDto) {
    const { name, phoneNumber, homeNo, province, district, ward, isDefault, email } = createUserAddress
    const countAddress = await this.userAddressModel.countDocuments({ cartId });
    if (countAddress === 2)
      throw new BadRequestException("Only create up to two address");
    if (isDefault) {
      await this.userAddressModel.updateMany({ cartId, isDefault: true }, { isDefault: false });
    }
    const result = await this.userAddressModel.create({
      cartId, name, phoneNumber,
      homeNo, province, district,
      ward, isDefault, email
    })
    return result._id;
  }

  async updateUserAddress(cartId: string, addressId: string, updateUserAddress: UpdateUserAddressDto) {
    const { name, phoneNumber, homeNo, province, district, ward, isDefault } = updateUserAddress;
    const existingAddress = await this.userAddressModel.findById(addressId).exec();
    if (!existingAddress)
      throw new BadRequestException("The address does not exist!");

    if (isDefault && existingAddress.isDefault !== true) {
      await this.userAddressModel.updateMany({ cartId, isDefault: true }, { isDefault: false });
    }

    await this.userAddressModel.updateOne({ cartId, _id: addressId },
      { name, phoneNumber, homeNo, province, district, ward, isDefault });

    return cartId;
  }

  async deleteUserAddress(cartId: string, addressId: string) {
    const existAddress = await this.userAddressModel.findOneAndDelete({ cartId, _id: addressId });
    if (!existAddress)
      throw new BadRequestException("The address does not exist!");
    if (existAddress.isDefault) {
      await this.userAddressModel.updateOne({ cartId }, { isDefault: true });
    }
    return "Delete address successfully";
  }
}

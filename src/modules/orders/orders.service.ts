import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { Cart } from '../carts/schemas/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>
  ) { }
  async create(createOrderDto: CreateOrderDto, cartId: string) {
    const { userId, totalAmount, products, shippingAddress, paymentMethod } = createOrderDto;

    const result = await this.orderModel.create({
      userId, totalAmount, products,
      shippingAddress, paymentMethod
    })

    await this.cartModel.updateOne({
      _id: cartId
    }, {
      productList: []
    });

    return {
      _id: result._id
    };
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

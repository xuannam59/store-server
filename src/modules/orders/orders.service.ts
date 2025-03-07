import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { Cart } from '../carts/schemas/cart.schema';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import aqp from 'api-query-params';
import { IUser } from '../users/users.interface';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private mailService: MailService,
    private notificationsService: NotificationsService
  ) { }

  async create(createOrderDto: CreateOrderDto, cartId: string) {
    const { userId, receiver, email, phoneNumber,
      address, totalAmount, products, paymentMethod } = createOrderDto;

    const result = await this.orderModel.create({
      userId, totalAmount, products,
      receiver, email, phoneNumber, address,
      paymentMethod
    });

    for (let product of products) {
      const exist = await this.productModel.findById(product._id);
      if (!exist)
        throw new BadRequestException("Find information failed");
      const version = exist.versions.find(item => item.color === product.color);

      if (!version)
        throw new BadRequestException(`${product.title} has not this color`);

      if (version.quantity === 0)
        throw new BadRequestException(`${product.title} out of stock`);

      if (version.quantity - product.quantity < 0)
        throw new BadRequestException(`The number of ${product.title} is not enough`);
    }

    await this.cartModel.updateOne({ _id: cartId }, { $set: { productList: [] } });

    const bulkOperations = products.map(product => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $inc: {
            sold: product.quantity,
            "versions.$[elem].quantity": -product.quantity
          }
        },
        arrayFilters: [{ "elem.color": product.color }]
      }
    }));
    await this.productModel.bulkWrite(bulkOperations);

    const infoMail = {
      email,
      data: result.toObject(),
      name: receiver,
      template: "order",
      subject: `Thông tin đơn đặt hàng của bạn tại Shop JunKun`
    }

    const data = {
      type: "order",
      typeId: result._id.toString(),
      title: "New Order",
      content: "A new order has been placed",
      from: result.receiver,
      to: "admin"
    }

    await this.notificationsService.create(data)

    this.mailService.sendMail(infoMail)

    return {
      _id: result._id
    };
  }

  async getStatistic() {
    const result = await this.orderModel.find().select("totalAmount products status");

    return result;
  }

  async getPurchaseStatistic(query: any) {
    let { start, end, numbers } = query;
    if (!start || !end || !numbers) return "OK";

    start = new Date(query.start.replace(" ", "+"));
    end = new Date(query.end.replace(" ", "+"));

    const promises = [];
    for (let i = 0; i < numbers; i++) {
      let filter: any = {}
      const day = new Date(start);
      if (numbers != 12) {
        day.setDate(day.getDate() + i);
        filter.createdAt = {
          $gte: new Date(day.setHours(0, 0, 0, 0)),
          $lte: new Date(day.setHours(23, 59, 59, 999))
        };
      } else {
        day.setMonth(day.getMonth() + i);
        filter.createdAt = {
          $gte: new Date(day.getFullYear(), day.getMonth(), 1, 0, 0, 0, 0),
          $lte: new Date(day.getFullYear(), day.getMonth() + 1, 0, 23, 59, 59, 999)
        };

      }

      promises.push(
        this.orderModel.find(filter).then((orders) => ({
          date: new Date(day),
          purchase: orders.reduce((prev, cur) => {
            if (cur.status === "success")
              return prev + cur.totalAmount;
            return prev;
          }, 0),
          orderTotal: orders.length,
          delivered: orders.filter(item => item.status === "success").length,
        }))
      );
    }

    return Promise.all(promises);
  }

  async findAll(current: number, pageSize: number, query: any) {
    const { sort } = aqp(query);
    const { startDate, endDate } = query
    let filter: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate.replace(" ", "+"));
      const end = new Date(endDate.replace(" ", "+"));
      filter.createdAt = {
        $gte: start,
        $lte: end
      }
    }

    let currentDefault = current ? current : 1;
    let limitDefault = pageSize ? pageSize : 10;

    const totalItems = await this.orderModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.orderModel
      .find(filter)
      .skip(skip)
      .limit(limitDefault)
      .sort(sort as any)
      .exec();

    return {
      meta: {
        current: currentDefault,
        pageSize: limitDefault,
        totalItems: totalItems,
        pages: totalPage
      },
      result: result
    };
  }

  async changeStatus(id: string, body, user: IUser) {
    const { status } = body;
    const result = await this.orderModel.findByIdAndUpdate(id,
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    if (!result)
      throw new BadRequestException("Change the status of the order failed!");

    return result._id;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}

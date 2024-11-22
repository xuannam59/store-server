import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from '../users/users.inerface';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) { }

  async create(createProductDto: CreateProductDto, user: IUser) {
    const { title, description, price,
      quantity, discountPercentage, thumbnail, categoryId,
      status, slider } = createProductDto;

    const product = await this.productModel.create({
      title, description, price,
      quantity, discountPercentage,
      thumbnail, status, slider, categoryId,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: product._id
    };
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs)
    delete filter.current
    delete filter.pageSize
    filter.isDeleted = false;

    let currentDefault = current ?? 1;
    let limitDefault = pageSize ?? 10;

    const totalItems = await this.productModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limitDefault)
      .sort(sort as any)
      .populate(population)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ")

    const result = await this.productModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!result)
      throw new BadRequestException("Không tìm thấy sản phẩm")

    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ")

    const result = await this.productModel.updateOne({
      _id: id,
      isDeleted: false
    }, {
      ...updateProductDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ")

    const result = await this.productModel.updateOne({
      _id: id,
    }, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return result;
  }
}

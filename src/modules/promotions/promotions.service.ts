import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from './schemas/promotion.schemas';
import mongoose, { Model } from 'mongoose';
import { VND } from '@/helpers/handleCurrency';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<Promotion>
  ) { }
  async create(createPromotionDto: CreatePromotionDto, user: IUser) {
    const {
      title, code, descriptions,
      quantityAvailable, startAt, endAt,
      type, value, image, maxValue, minValue,
    } = createPromotionDto
    if (endAt < startAt)
      throw new BadRequestException("the end date must be greater than the start date");
    const result = await this.promotionModel.create({
      title, code, descriptions,
      quantityAvailable, startAt, endAt,
      type, value, image, maxValue, minValue,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return { _id: result._id };
  }

  async findAll(current: number, pageSize: number, qs) {
    const { filter, sort, population } = aqp(qs)
    delete filter.current
    delete filter.pageSize
    filter.isDeleted = false;

    let currentDefault = current ? current : 1;
    let limitDefault = pageSize ? pageSize : 10;

    const totalItems = await this.promotionModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.promotionModel
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

  async checkDiscountCode(code: string, totalAmount: number) {
    const codeExist = await this.promotionModel.findOne({ code });

    if (!codeExist)
      throw new BadRequestException("code is incorrect");

    if (codeExist.quantityAvailable <= 0)
      throw new BadRequestException("code not available");

    const now = Date.now();

    if (codeExist.startAt.getTime() > now)
      throw new BadRequestException("code not available");

    if (codeExist.endAt && codeExist.endAt.getTime() < now)
      throw new BadRequestException("code expired");

    if (totalAmount < codeExist.minValue)
      throw new BadRequestException(`Order value must be greater than ${VND.format(codeExist.minValue)}`);

    return codeExist;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id promotion không hợp lệ");

    const result = await this.promotionModel.updateOne({
      _id: id
    }, {
      ...updatePromotionDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id promotion không hợp lệ");

    const result = await this.promotionModel.updateOne({
      _id: id
    }, {
      isDeleted: true,
      deletedAt: Date.now(),
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return result;
  }
}

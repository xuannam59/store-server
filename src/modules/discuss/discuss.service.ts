import { Injectable } from '@nestjs/common';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Discuss } from './schemas/discuss.schema';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class DiscussService {
  constructor(
    @InjectModel(Discuss.name) private discussModel: Model<Discuss>,
    @InjectModel(Product.name) private productModule: Model<Product>,
  ) { }
  async createDiscuss(createDiscussDto: CreateDiscussDto, user: IUser) {
    const { comment, parent_id } = createDiscussDto;

    const result = await this.discussModel.create({
      comment, parent_id,
      created_by: user._id
    });

    return {
      _id: result._id
    }
  }

  async fetchDiscuss(pageSize: number, qs: string) {
    const { filter } = aqp(qs);
    delete filter.pageSize;
    filter.isDeleted = false;

    const result = await this.discussModel.find(filter)
      .limit(pageSize)
      .sort({ createdAt: "desc" })
      .populate({ path: "created_by", select: "name avatar" })

    return result;
  }
}

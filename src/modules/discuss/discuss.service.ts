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

  async deleteDiscuss(discussId: string) {
    const queue = [discussId];
    const allIdsToDelete = new Set(queue);
    while (queue.length > 0) {
      const currentLevelIds = queue.splice(0, queue.length);
      const children = await this.discussModel.find({ parent_id: { $in: currentLevelIds } }, { _id: 1 });

      if (children.length > 0) {
        const childrenIds = children.map(c => c._id.toString());
        queue.push(...childrenIds);
        childrenIds.forEach(id => allIdsToDelete.add(id));
      }
    }

    await this.discussModel.deleteMany({ _id: { $in: Array.from(allIdsToDelete) } });

    return `Deleted successful ${allIdsToDelete.size} comments`;
  }
}

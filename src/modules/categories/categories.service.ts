import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto, user: IUser) {
    const { title, description, status, parentId, image, displayMode } = createCategoryDto;

    const exist = await this.categoryModel.findOne({
      title: title,
      isDeleted: false
    });
    if (exist)
      throw new BadRequestException("Danh mục này đã tồn tại");
    const category = await this.categoryModel.create({
      title, description, status, parentId, image, displayMode,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: category._id
    };
  }

  async findAll(qs: string) {
    const { filter, sort } = aqp(qs)
    filter.isDeleted = false;

    const totalItems = await this.categoryModel.countDocuments(filter);

    const result = await this.categoryModel
      .find(filter)
      .select("title status slug displayMode image parentId")
      .exec();

    return {
      meta: {
        totalItems: totalItems
      },
      result: result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id category không hợp lệ")

    const result = await this.categoryModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!result)
      throw new BadRequestException("Không tìm thấy danh mục")

    return result;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id category không hợp lệ")

    const result = await this.categoryModel.updateOne({
      _id: id,
      isDeleted: false
    }, {
      ...updateCategoryDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id category không hợp lệ")

    const result = await this.categoryModel.updateOne({
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

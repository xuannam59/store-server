import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schemas';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import { use } from 'passport';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: Model<Permission>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, method, apiPath, module } = createPermissionDto;
    const exist = await this.permissionModel.findOne({
      method: method,
      apiPath: apiPath
    })
    if (exist) throw new BadRequestException("Permission này đã có trong hệ thống");

    const newPermission = await this.permissionModel.create({
      name, method, apiPath, module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newPermission._id
    };
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs)
    delete filter.current
    delete filter.pageSize
    filter.isDeleted = false;

    let currentDefault = current ?? 1;
    let limitDefault = pageSize ?? 10;

    const totalItems = await this.permissionModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.permissionModel
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
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id permission không hợp lệ")

    const result = await this.permissionModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!result)
      throw new BadRequestException("Không tìm thấy quyền hạn")

    return result;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id permission không hợp lệ")

    const result = await this.permissionModel.updateOne({
      _id: id,
      isDeleted: false
    }, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id permission không hợp lệ")

    const result = await this.permissionModel.updateOne({
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

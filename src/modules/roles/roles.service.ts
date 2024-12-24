import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, isActive, description, permissions } = createRoleDto;

    const roleExist = await this.roleModel.findOne({
      name: name,
      isDeleted: false
    })
    if (roleExist)
      throw new BadRequestException("Role đã tồn tại trong hệ thống");

    const role = await this.roleModel.create({
      name, isActive,
      description, permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: role._id
    };
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs)
    delete filter.current
    delete filter.pageSize
    filter.isDeleted = false;

    let currentDefault = current ?? 1;
    let limitDefault = pageSize ?? 10;

    const totalItems = await this.roleModel.countDocuments(filter);
    const totalPage = Math.ceil(totalItems / limitDefault);

    let skip = (currentDefault - 1) * limitDefault;

    const result = await this.roleModel
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

    const result = await this.roleModel.findOne({
      _id: id,
      isDeleted: false
    }).populate({ path: "permissions", select: { name: 1, method: 1, apiPath: 1, module: 1 } });

    if (!result)
      throw new BadRequestException("Không tìm thấy Vai trò")

    return result;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ")

    const result = await this.roleModel.updateOne({
      _id: id,
      isDeleted: false
    }, {
      ...updateRoleDto,
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

    const result = await this.roleModel.updateOne({
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

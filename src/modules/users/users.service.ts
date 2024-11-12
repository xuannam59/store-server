import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/util';
import aqp from 'api-query-params';
import { RegisterUser } from '@/auth/dto/auth-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { }

  // hash password


  // [POST] /users
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, age, gender, address, role } = createUserDto;

    const isExist = await this.userModel.findOne({
      email
    });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trong hệ thống`);
    }

    const hashPassword = hashPasswordHelper(password);

    const result = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role
    })

    return {
      _id: result._id
    };
  }

  // [GET] /user
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    const defaultLimit = limit ? limit : 10;
    const defaultCurrent = currentPage ? currentPage : 1;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    let skip = (defaultCurrent - 1) * defaultLimit;

    const result = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(defaultLimit)
      .populate(population)
      .select("-password")
      .exec();

    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        totalItems: totalItems,
        pages: totalPages
      },
      result: result
    };
  }

  // [GET] /user/:id
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ");

    const user = await this.userModel.findOne({
      _id: id,
      isDeleted: false
    }).select("-password");

    return user;
  }

  // [PATCH] /users/:id
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ");

    const result = await this.userModel.updateOne(
      { _id: id },
      { ...updateUserDto }
    )
    return result;
  }

  // [DELETE] /users/:id
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id không hợp lệ");

    const result = await this.userModel.updateOne(
      {
        _id: id
      },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );
    return result;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      isDeleted: false
    })

    return user.toObject();
  }

  async findUserByToken(refreshToken: string) {
    const user = this.userModel.findOne({
      refresh_token: refreshToken,
      isDeleted: false
    });
    return user;
  }

  // [POST] /auth/register
  async register(registerUser: RegisterUser) {
    const { email, password, confirmPassword, name, phone, address } = registerUser

    const isExist = await this.userModel.findOne({
      email: email,
      isDeleted: false
    });

    if (isExist)
      throw new BadRequestException(`email: ${email} đã tồn tại trong hệ thống`)

    if (password !== confirmPassword)
      throw new BadRequestException("password/ confirmPassword không giống nhau")

    const hashPassword = hashPasswordHelper(password)

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      role: "USER"
    })
    return newUser;
  }

  async updateUserRefresh(refreshToken: string, _id: string) {
    const result = await this.userModel.updateOne({ _id }, {
      refresh_token: refreshToken
    });
    return result;
  }
}

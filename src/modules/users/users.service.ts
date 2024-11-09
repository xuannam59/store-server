import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/util';


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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({
      email: username
    })

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

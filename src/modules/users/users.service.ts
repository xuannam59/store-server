import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { comparePasswordHelper, hashPasswordHelper } from 'src/helpers/util';
import aqp from 'api-query-params';
import { RegisterUser } from '@/auth/dto/auth-user.dto';
import { IUser } from './users.interface';
import { Role } from '../roles/schemas/role.schema';
import { generateRandomNumber } from '@/helpers/generate';
import { ForgotPassword } from './schemas/forgot-password.schema';
import { MailService } from '../mail/mail.service';
import { title } from 'process';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(ForgotPassword.name) private forgotPasswordModel: Model<ForgotPassword>,
    private mailerService: MailService
  ) { }


  // [POST] /users
  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, phone } = createUserDto;

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
      role,
      phone,
      createdBy: {
        _id: user._id,
        email: user.email
      }
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
      .sort(sort as any)
      .limit(defaultLimit)
      .populate({ path: "role", select: { title: 1 } })
      .select("-password -refresh_token")
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
      throw new BadRequestException("id user không hợp lệ");

    const user = await this.userModel.findOne({
      _id: id,
      isDeleted: false
    })
      .select("-password -refresh_token")
      .populate({ path: "role", select: { title: 1 } });

    return user;
  }

  // [PATCH] /users/:id
  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id user không hợp lệ");
    const { name, age, gender, address, avatar, role, phone } = updateUserDto
    const result = await this.userModel.updateOne(
      { _id: id },
      {
        name, age, gender, phone,
        address, avatar, role,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return result;
  }

  // [DELETE] /users/:id
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException("id user không hợp lệ");

    const isExist = await this.userModel.findById(id);
    if (!isExist) {
      throw new BadRequestException("Không tìm thấy người dùng");
    }
    // if (isExist.role === "ADMIN") {
    //   throw new BadRequestException("Tài khoản admin không thể xoá");
    // }

    const result = await this.userModel.updateOne(
      {
        _id: id
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        },
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
    }).populate({ path: "role", select: { title: 1 } })

    return user;
  }

  async findUserByToken(refreshToken: string) {
    const user = this.userModel.findOne({
      refresh_token: refreshToken,
      isDeleted: false
    }).populate({ path: "role", select: { title: 1 } });
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

    const role = await this.roleModel.findOne({
      name: "USER"
    });

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      role: role._id
    })
    return newUser;
  }

  async updateUserRefresh(refreshToken: string, _id: string) {
    const result = await this.userModel.updateOne({ _id }, {
      refresh_token: refreshToken
    });
    return result;
  }

  // [POST] /auth/forgot-password
  async forgotPassword(email: string) {
    const exist = await this.userModel.findOne({
      email: email,
      isDeleted: false
    })
    if (!exist)
      throw new BadRequestException("Tài khoản không tồn tại trong hê thống");

    // xoá mã cũ
    await this.forgotPasswordModel.deleteOne({ email: email });

    const otp = generateRandomNumber(6);

    // xứ lý gửi mã otp qua mail
    const dataMail = {
      email,
      data: otp,
      name: exist.name,
      template: "send-otp",
      subject: `Mã OTP: ${otp}`
    }
    this.mailerService.sendMail(dataMail);

    const result = await this.forgotPasswordModel.create({
      email,
      otp
    })
    return {
      email: result.email,
      userId: exist._id
    }
  }

  // [POST] /auth/confirm-code
  async confirmCode(email: string, otp: string) {
    const existCode = await this.forgotPasswordModel.findOne({
      email,
      otp
    })
    if (!existCode)
      throw new BadRequestException("Mã không hợp lễ vui lòng kiểm tra lại");

    return {
      email: existCode.email
    }
  }

  // [POST] /auth/reset-password
  async resetPassword(email: string, otp: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword)
      throw new BadRequestException("password and confirmPassword are not the same");

    const existOtp = await this.forgotPasswordModel.findOne({
      email,
      otp
    });

    if (!existOtp)
      throw new BadRequestException("Please re-implement the password forgotten feature");

    const hashPassword = hashPasswordHelper(password);
    const result = await this.userModel.updateOne({
      email,
      isDeleted: false
    }, {
      password: hashPassword
    });

    return result;
  }

  // [Patch] /auth/change-password
  async ChangePassword(user: IUser, oldPassword: string, newPassword: string, confirmPassword: string) {
    const infoUser = await this.userModel.findOne({
      _id: user._id,
      email: user.email,
      isDeleted: false
    });

    if (!comparePasswordHelper(oldPassword, infoUser.password))
      throw new BadRequestException("oldPassword is incorrect");

    if (newPassword !== confirmPassword)
      throw new BadRequestException("newPassword and confirmPassword are the same");

    const hashNewPassword = hashPasswordHelper(newPassword);
    await this.userModel.updateOne({
      _id: user._id,
      email: user.email,
    }, {
      password: hashNewPassword
    })

    return "Change the password successfully"
  }

}

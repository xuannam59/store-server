import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // [POST] /users
  @Post()
  @ResponseMessage("Create a new user")
  create(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.create(createUserDto, user);
  }

  // [GET] /users
  @ResponseMessage("Fetch users with pagination")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  // [GET] /users/:id
  @ResponseMessage("Fetch a new user by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // [PATCH] /users/:id
  @ResponseMessage("Update a user")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  // [DELETE] /users/:id
  @ResponseMessage("Delete a user")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.usersService.remove(id, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from './users.interface';
import { PermissionGuard } from '@/guards/permission.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //[POST] api/v1/users
  @UseGuards(PermissionGuard)
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

  //[PATCH] api/v1/users/:id
  @UseGuards(PermissionGuard)
  @ResponseMessage("Update a user")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  //[DELETED] api/v1/users/:id
  @UseGuards(PermissionGuard)
  @ResponseMessage("Delete a user")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.usersService.remove(id, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage("Create a new role")
  create(
    @Body() createRoleDto: CreateRoleDto,
    @User() user: IUser
  ) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("fetch roles with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() query
  ) {
    return this.rolesService.findAll(+current, +pageSize, query);
  }

  @Get(':id')
  @ResponseMessage("fetch a role by id")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a role")
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete a role")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.rolesService.remove(id, user);
  }
}

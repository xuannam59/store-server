import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';
import { PermissionGuard } from '@/guards/permission.guards';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  //[POST] api/v1/permissions
  @UseGuards(PermissionGuard)
  @Post()
  @ResponseMessage("Create a new permission")
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage("fetch permissions with pagination")
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() query,
  ) {
    return this.permissionsService.findAll(+current, +pageSize, query);
  }

  @Get(':id')
  @ResponseMessage("fetch a permission by id")
  findOne(
    @Param('id') id: string
  ) {
    return this.permissionsService.findOne(id);
  }

  //[PATCH] api/v1/permissions/:id
  @UseGuards(PermissionGuard)
  @Patch(':id')
  @ResponseMessage("update a  permission")
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  //[DELETE] api/v1/permissions/:id
  @UseGuards(PermissionGuard)
  @Delete(':id')
  @ResponseMessage("delete a  permission")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}

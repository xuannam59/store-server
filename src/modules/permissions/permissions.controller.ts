import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from '@/decorators/customize';
import { IUser } from '../users/users.inerface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}

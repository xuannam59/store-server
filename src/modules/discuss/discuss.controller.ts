import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { Public, ResponseMessage, User } from '@/decorators/customize';
import { IUser } from '../users/users.interface';

@Controller('discuss')
export class DiscussController {
  constructor(private readonly discussService: DiscussService) { }

  @Post()
  @ResponseMessage("Create")
  create(
    @Body() createDiscussDto: CreateDiscussDto,
    @User() user: IUser
  ) {
    return this.discussService.createDiscuss(createDiscussDto, user);
  }

  @Public()
  @ResponseMessage("Fetch")
  @Get()
  fetchDiscuss(
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return this.discussService.fetchDiscuss(+pageSize, qs);
  }

  @Public()
  @ResponseMessage("Delete")
  @Delete(":id")
  deleteDiscuss(
    @Param("id") id: string
  ) {
    return this.discussService.deleteDiscuss(id);
  }

}

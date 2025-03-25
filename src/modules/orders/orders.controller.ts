import { Public, ResponseMessage, User } from '@/decorators/customize';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '../users/users.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { PermissionGuard } from '@/guards/permission.guards';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Public()
  @ResponseMessage("Create a new order")
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request
  ) {
    const cartId = req.cookies["cart_id"]
    return this.ordersService.create(createOrderDto, cartId);
  }

  @Get("statistic")
  @ResponseMessage("Get Statistic")
  getStatistic() {
    return this.ordersService.getStatistic();
  }

  @Get("purchase-statistic")
  @ResponseMessage("Get Statistic")
  getPurchaseStatistic(
    @Query() query: any
  ) {
    return this.ordersService.getPurchaseStatistic(query);
  }

  @Get()
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() query
  ) {
    return this.ordersService.findAll(+current, +pageSize, query);
  }

  //[PATCH] api/v1/orders/:id
  @UseGuards(PermissionGuard)
  @Patch('update/:id')
  @ResponseMessage("Change the status of the order")
  update(
    @Param('id') id: string,
    @User() user: IUser,
    @Body() body
  ) {
    return this.ordersService.changeOrder(id, body, user);
  }
}

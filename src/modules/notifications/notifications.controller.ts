import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ResponseMessage } from '@/decorators/customize';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  findAll(
    @Query("limit") limit: string
  ) {
    return this.notificationsService.findAll(+limit);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}

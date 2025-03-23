import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) { }

  async create(createNotification: CreateNotificationDto) {
    const result = await this.notificationModel.create(createNotification);

    return result._id;
  }

  async findAll(limit: number) {
    const filter = {
      to: "admin"
    }
    const defaultLimit = limit ? limit : 5;
    const totalItems = await this.notificationModel.countDocuments({
      ...filter,
      isRead: false
    });
    const result = await this.notificationModel
      .find(filter)
      .limit(defaultLimit)
      .sort({ createdAt: "desc" });


    return {
      totalItems,
      result
    };
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}

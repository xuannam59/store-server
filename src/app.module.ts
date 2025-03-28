import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MailModule } from './modules/mail/mail.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { CartsModule } from './modules/carts/carts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DiscussModule } from './modules/discuss/discuss.module';
import { OrdersModule } from './modules/orders/orders.module';
import mongooseSlugUpdater from 'mongoose-slug-updater';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PayOsModule } from './modules/pay-os/pay-os.module';
import { GeneralSettingModule } from './modules/general-setting/general-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(mongooseSlugUpdater); // Add the plugin here
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          username: configService.get<string>('REDIS_USERNAME'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FileModule,
    CloudinaryModule,
    ProductsModule,
    CategoriesModule,
    MailModule,
    RolesModule,
    PermissionsModule,
    PromotionsModule,
    CartsModule,
    ReviewsModule,
    DiscussModule,
    OrdersModule,
    NotificationsModule,
    PayOsModule,
    GeneralSettingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

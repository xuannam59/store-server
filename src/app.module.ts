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
import mongooseSlugUpdater from 'mongoose-slug-updater';

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
    CartsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

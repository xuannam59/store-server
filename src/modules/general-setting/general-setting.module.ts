import { Module } from '@nestjs/common';
import { GeneralSettingService } from './general-setting.service';
import { GeneralSettingController } from './general-setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneralSetting, GeneralSettingSchema } from './schemas/general-setting.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: GeneralSetting.name, schema: GeneralSettingSchema }
  ])],
  controllers: [GeneralSettingController],
  providers: [GeneralSettingService],
})
export class GeneralSettingModule { }

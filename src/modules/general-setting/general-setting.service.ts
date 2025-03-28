import { Injectable } from '@nestjs/common';
import { CreateGeneralSettingDto } from './dto/create-general-setting.dto';
import { UpdateGeneralSettingDto } from './dto/update-general-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GeneralSetting } from './schemas/general-setting.schema';
import { Model } from 'mongoose';

@Injectable()
export class GeneralSettingService {
  constructor(@InjectModel(GeneralSetting.name) private generalSettingModel: Model<GeneralSetting>) { }

  async findOne() {
    const result = await this.generalSettingModel.findOne({});
    return result;
  }

  async update(id: string, updateGeneralSettingDto: UpdateGeneralSettingDto) {
    await this.generalSettingModel.updateOne({ _id: id }, updateGeneralSettingDto)

    return "Update Successfully";
  }
}

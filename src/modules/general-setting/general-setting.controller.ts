import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { GeneralSettingService } from './general-setting.service';
import { UpdateGeneralSettingDto } from './dto/update-general-setting.dto';

@Controller('general-setting')
export class GeneralSettingController {
  constructor(private readonly generalSettingService: GeneralSettingService) { }

  @Get()
  findOne() {
    return this.generalSettingService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralSettingDto: UpdateGeneralSettingDto) {
    return this.generalSettingService.update(id, updateGeneralSettingDto);
  }

}

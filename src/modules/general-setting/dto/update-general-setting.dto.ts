import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralSettingDto } from './create-general-setting.dto';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGeneralSettingDto extends PartialType(CreateGeneralSettingDto) {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    logo: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    slides: string[];

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    address: string[];
}

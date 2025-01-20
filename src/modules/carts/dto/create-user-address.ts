import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserAddressDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    homeNo: string;

    @IsNotEmpty()
    province: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    ward: string;

    @IsNotEmpty()
    isDefault: boolean;
}
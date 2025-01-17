import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserAddressDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phoneNumber: string;

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
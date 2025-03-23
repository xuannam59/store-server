import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsString()
    phone: string;


    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsString()
    role: string;

    @IsString()
    @IsOptional()
    avatar: string;
}

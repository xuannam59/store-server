import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string;

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsNumber()
    age: number;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    gender: string;

    @IsString()
    role: string;

    @IsString()
    avatar: string;
}

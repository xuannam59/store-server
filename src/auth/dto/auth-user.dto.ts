import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterUser {
    @IsNotEmpty({ message: "name không được để trống" })
    name: string

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "password không được để trống" })
    password: string

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string

    @IsNotEmpty({ message: "phone không được để trống" })
    phone: string

    address: string
}

export class CreateForgotPassword {
    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string
}

export class ConfirmCode {
    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "otp không được để trống" })
    otp: string
}

export class ResetPassword {
    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "email không đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "otp không được để trống" })
    otp: string

    @IsNotEmpty({ message: "password không được để trống" })
    password: string

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string
}

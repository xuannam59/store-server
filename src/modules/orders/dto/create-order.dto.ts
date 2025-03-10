import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class Product {
    @IsNotEmpty()
    _id: string

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    thumbnail: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    cost: number;
}

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    userId: string

    @IsNotEmpty()
    receiver: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    totalAmount: number

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Product)
    products: Product[]

    @IsNotEmpty()
    paymentMethod: string;
}

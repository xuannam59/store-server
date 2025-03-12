import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class Product {
    @IsNotEmpty()
    @IsString()
    _id: string

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    color: string;

    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    cost: number;
}

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    receiver: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    discountCode: string;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Product)
    products: Product[]

    @IsNotEmpty()
    @IsString()
    paymentMethod: string;
}

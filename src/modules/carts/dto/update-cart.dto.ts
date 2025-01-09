import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Product {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class UpdateCartDto {

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => Product)
    productList: Product
}

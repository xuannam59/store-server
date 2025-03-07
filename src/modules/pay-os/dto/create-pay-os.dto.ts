import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

class Item {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    price: number
}

export class CreatePayOSDto {
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    returnUrl: string;

    @IsNotEmpty()
    cancelUrl: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Item)
    items: Item[];
}
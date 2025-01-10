import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDto {
    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

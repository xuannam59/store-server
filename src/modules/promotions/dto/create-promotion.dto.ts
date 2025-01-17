import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePromotionDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty()
    @IsNumber()
    value: number

    @IsOptional()
    @IsNumber()
    maxValue: number

    @IsOptional()
    @IsNumber()
    minValue: number

    @IsString()
    @IsOptional()
    descriptions: string

    @IsNumber()
    @IsNotEmpty()
    quantityAvailable: number

    @IsNotEmpty()
    @IsString()
    type: string

    @IsNotEmpty()
    startAt: Date

    @IsOptional()
    @IsNotEmpty()
    endAt: Date

    @IsString()
    @IsOptional()
    image: string
}

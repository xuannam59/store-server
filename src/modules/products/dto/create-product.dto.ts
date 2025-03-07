import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Versions {
    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    quantity: number
}

export class CreateProductDto {
    @IsNotEmpty({ message: "title không được để trống" })
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsNotEmpty({ message: "cost không được để trống" })
    @IsNumber({}, { message: "cost phải làm kiểu number" })
    cost: number

    @IsNotEmpty({ message: "price không được để trống" })
    @IsNumber({}, { message: "price phải làm kiểu number" })
    price: number

    @IsNotEmpty({ message: "discountPercentage không được để trống" })
    @IsNumber({}, { message: "discountPercentage phải làm kiểu number" })
    discountPercentage: number

    @IsNotEmpty({ message: "status không được để trống" })
    status: string

    @IsArray({ message: "images có dạng là array" })
    @IsString({ each: true, message: "image có định dạng string" })
    images: string[]

    @IsString()
    @IsNotEmpty()
    thumbnail: string

    @IsMongoId()
    categoryId: mongoose.Schema.Types.ObjectId

    @IsOptional()
    @IsString()
    chip: string

    @IsOptional()
    @IsString()
    ram: string

    @IsOptional()
    @IsString()
    ssd: string

    @IsOptional()
    @IsString()
    gpu: string

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Versions)
    versions: Versions[]
}

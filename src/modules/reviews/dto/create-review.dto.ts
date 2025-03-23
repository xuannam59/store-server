import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsString()
    product_id: string

    @IsOptional()
    @IsString()
    parent_id: string

    @IsNotEmpty()
    star: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images: string[]
}

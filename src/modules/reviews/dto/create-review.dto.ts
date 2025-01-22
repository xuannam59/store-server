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
    @IsMongoId()
    parent_id: mongoose.Types.ObjectId

    @IsNotEmpty()
    star: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images: string[]
}

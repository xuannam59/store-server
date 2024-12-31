import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";


export class CreateCategoryDto {
    @IsNotEmpty({ message: "title không được để trống" })
    @IsString()
    title: string;

    @IsNotEmpty({ message: "status không được để trống" })
    @IsString()
    status: string;

    @IsOptional()
    @IsMongoId()
    parentId: mongoose.Schema.Types.ObjectId

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image: string

    @IsOptional()
    @IsBoolean()
    displayMode: boolean
}

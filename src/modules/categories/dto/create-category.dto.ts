import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";


export class CreateCategoryDto {
    @IsNotEmpty({ message: "title không được để trống" })
    @IsString()
    title: string;

    @IsNotEmpty({ message: "status không được để trống" })
    @IsString()
    status: string;

    @IsMongoId()
    parentId: mongoose.Schema.Types.ObjectId

    @IsString()
    description: string
}

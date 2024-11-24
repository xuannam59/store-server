import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";


export class CreateCategoryDto {
    @IsNotEmpty({ message: "title không được để trống" })
    title: string;

    @IsNotEmpty({ message: "status không được để trống" })
    status: string;

    parentId: mongoose.Schema.Types.ObjectId
    description: string
}

import { IsArray, IsBoolean, IsEmpty, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose"

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    permissions: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}

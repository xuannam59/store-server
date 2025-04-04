import { IsNotEmpty, IsString } from "class-validator"


export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    method: string

    @IsNotEmpty()
    @IsString()
    apiPath: string

    @IsNotEmpty()
    @IsString()
    module: string
}

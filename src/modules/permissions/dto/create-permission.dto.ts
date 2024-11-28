import { IsNotEmpty, IsString } from "class-validator"


export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    method: string

    @IsNotEmpty()
    @IsString()
    aipPath: string

    @IsNotEmpty()
    @IsString()
    module: string
}

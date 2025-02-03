import { IsNotEmpty, IsOptional } from "class-validator"


export class CreateDiscussDto {
    @IsNotEmpty()
    comment: string

    @IsNotEmpty()
    parent_id: string
}

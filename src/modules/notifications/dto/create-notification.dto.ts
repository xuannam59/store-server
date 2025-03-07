import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    typeId: string

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    from: string

    @IsNotEmpty()
    to: string
}
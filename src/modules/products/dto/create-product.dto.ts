import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: "title không được để trống" })
    title: string

    @IsNotEmpty({ message: "description không được để trống" })
    description: string

    @IsNotEmpty({ message: "price không được để trống" })
    @IsNumber({}, { message: "price phải làm kiểu number" })
    price: number

    @IsNotEmpty({ message: "discountPercentage không được để trống" })
    @IsNumber({}, { message: "discountPercentage phải làm kiểu number" })
    discountPercentage: number

    @IsNotEmpty({ message: "quantity không được để trống" })
    @IsNumber({}, { message: "quantity phải làm kiểu number" })
    quantity: number

    @IsNotEmpty({ message: "thumbnail không được để trống" })
    thumbnail: string

    @IsNotEmpty({ message: "status không được để trống" })
    status: string

    @IsArray({ message: "slider có dạng là array" })
    @IsString({ each: true, message: "slider có định dạng string" })
    slider: string[]

    categoryId: string
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";


export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop()
    title: string

    @Prop()
    description: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Category" })
    categoryId: mongoose.Schema.Types.ObjectId

    @Prop()
    price: number

    @Prop()
    discountPercentage: number

    @Prop()
    images: string[]

    @Prop()
    status: string

    @Prop()
    versions: {
        color: string,
        quantity: number
    }[]

    @Prop({
        type: String,
        slug: "title",
        unique: true
    })
    slug: string

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
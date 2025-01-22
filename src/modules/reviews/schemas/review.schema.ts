import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ReviewDocument = HydratedDocument<Review>

@Schema({ timestamps: true })
export class Review {

    @Prop()
    comment: string

    @Prop()
    product_id: string

    @Prop()
    parent_id: string

    @Prop()
    star: number

    @Prop()
    images: string[]

    @Prop({ type: String, ref: "User" })
    created_by: string

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

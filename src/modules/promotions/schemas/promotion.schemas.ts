import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PromotionDocument = HydratedDocument<Promotion>

@Schema({ timestamps: true })
export class Promotion {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    code: string

    @Prop()
    value: number

    @Prop()
    descriptions: string

    @Prop()
    maxValue: number

    @Prop({ type: Number, default: 0 })
    minValue: number

    @Prop({ default: 100 })
    quantityAvailable: number

    @Prop({ default: "discount" })
    type: string

    @Prop({ required: true })
    startAt: Date

    @Prop()
    endAt: Date

    @Prop()
    image: string

    @Prop({
        type: String,
        slug: "code",
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

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

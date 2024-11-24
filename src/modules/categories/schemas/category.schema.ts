import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>

@Schema({ timestamps: true })
export class Category {
    @Prop()
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Category" })
    parentId: mongoose.Schema.Types.ObjectId

    @Prop({
        type: String,
        slug: 'title',
        unique: true
    })
    slug: string

    @Prop()
    status: string;

    @Prop()
    description: string

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
};

export const CategorySchema = SchemaFactory.createForClass(Category);

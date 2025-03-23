import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PermissionDocument = HydratedDocument<Permission>

@Schema({ timestamps: true })
export class Permission {
    @Prop()
    title: string

    @Prop()
    method: string

    @Prop()
    apiPath: string

    @Prop()
    module: string

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);

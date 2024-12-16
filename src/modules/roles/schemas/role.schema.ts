import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";

export type RoleDocument = HydratedDocument<Role>

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Permission" })
    permissions: mongoose.Schema.Types.ObjectId[]

    @Prop()
    description: string

    @Prop()
    isActive: boolean

    @Prop({
        type: String,
        slug: "name",
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

export const RoleSchema = SchemaFactory.createForClass(Role);

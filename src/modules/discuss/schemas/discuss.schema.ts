import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type DiscussDocument = HydratedDocument<Discuss>;

@Schema({ timestamps: true })
export class Discuss {
    @Prop()
    comment: string

    @Prop()
    parent_id: string

    @Prop({ type: String, ref: "User" })
    created_by: string

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const DiscussSchema = SchemaFactory.createForClass(Discuss);

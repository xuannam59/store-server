import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop()
    type: string;

    @Prop()
    typeId: string;

    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop({ type: Boolean, default: false })
    isRead: boolean

    @Prop()
    from: string

    @Prop()
    to: string
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
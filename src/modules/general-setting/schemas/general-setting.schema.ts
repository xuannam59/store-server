import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type GeneralSettingDocument = HydratedDocument<GeneralSetting>;

@Schema({ timestamps: true })
export class GeneralSetting {

    @Prop()
    title: string;

    @Prop()
    logo: string;

    @Prop()
    slides: string[];

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string[];

    @Prop({ type: Object })
    updatedBy: {
        _id: string;
        email: string;
    }
}

export const GeneralSettingSchema = SchemaFactory.createForClass(GeneralSetting);

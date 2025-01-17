import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type UserAddressDocument = HydratedDocument<UserAddress>;

@Schema({ timestamps: true })
export class UserAddress {
    @Prop()
    name: string

    @Prop()
    phoneNumber: string;

    @Prop()
    homeNo: string;

    @Prop()
    province: string;

    @Prop()
    district: string;

    @Prop()
    ward: string;

    @Prop()
    isDefault: boolean;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
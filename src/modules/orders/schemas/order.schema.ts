import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: String, ref: "User" })
    userId: string;

    @Prop()
    receiver: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    address: string;

    @Prop()
    email: string;

    @Prop()
    totalAmount: number;

    @Prop()
    products: {
        title: string,
        quantity: string,
        color: string,
        thumbnail: string,
        price: string,
    }[];

    @Prop({ type: Number, default: 0 })
    status: number;

    @Prop({ type: Number, default: 0 })
    paymentStatus: number;

    @Prop()
    paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
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
    discountCode: string;

    @Prop()
    products: {
        _id: string,
        title: string,
        quantity: string,
        color: string,
        thumbnail: string,
        price: string,
        cost: number,
        review: boolean
    }[];

    @Prop({ type: Number, default: 0, enum: [0, 1, 2, 3, 4] })
    status: number;

    @Prop({ type: String, default: "" })
    payId: string;

    @Prop({ type: Number, default: 0 })
    paymentStatus: number;

    @Prop()
    paymentMethod: string;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: Object })
    updatedBy: {
        _id: string,
        email: string
    };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
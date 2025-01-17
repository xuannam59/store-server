import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    userId: mongoose.Schema.Types.ObjectId

    @Prop({
        type: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            color: String,
        }]
    })
    productList: {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: number,
        color: string,
    }[]

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "UserAddress" })
    userAddress: mongoose.Schema.Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

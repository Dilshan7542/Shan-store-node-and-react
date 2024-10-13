/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import mongoose, {Document, Schema} from "mongoose";
import {IOrder} from "./Order";
import {IBook} from "./Book";

 interface IOrderDetail extends Document {
    orderID: IOrder['_id'];
    bookID: IBook['_id'];
    qty: number;
    price: number;
}
const orderDetailSchema=new Schema<IOrderDetail>({
    orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    bookID: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
});

const OrderDerail
    =mongoose.model<IOrderDetail>('orderDetail',orderDetailSchema);

export {OrderDerail,IOrderDetail};
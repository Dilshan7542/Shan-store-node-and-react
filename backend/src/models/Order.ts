/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import mongoose, {Document, Schema} from 'mongoose';

import {IStudent} from "./Student";

interface IOrder extends Document {
    orderID: string;
    studentID: IStudent['_id'];
    date: string;
    time: string;
}

const orderSchema = new Schema<IOrder>({
    orderID: {type: String, required: true},
    studentID: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    date: {type: String, required: true},
    time: {type: String, required: true}
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export {Order, IOrder}
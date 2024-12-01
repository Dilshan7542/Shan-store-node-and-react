/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/15/2024
 */
import {Request, RequestHandler, Response} from "express";
import {IOrder, Order} from "../models/Order";
import mongoose, {Types} from "mongoose";
import {IAppResponse} from "../interfaces/IAppResponse";
import {IOrderDetail, OrderDerail} from "../models/OrderDetail";
import { format } from "date-fns";
import {ResponseCode} from "../constant/ResponseCode";

interface IOrderWithDetail extends IOrder {
    orderDetail: IOrderDetail[]
}

export class OrderController {

    getOrderList: RequestHandler = async (req, res: Response<IAppResponse<IOrder[]>>, next) => {
        try {
          let orderList = await  Order.find<IOrder>({studentID:req.params['studentID']}).exec();
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: orderList});
        } catch (e) {
            next(e);
        }
    }

    saveOrder: RequestHandler = async (req: Request, res:Response<IAppResponse<IOrder>>, next) => {
        let session = await mongoose.startSession();
        try {
            const now = new Date();
            const formattedDate = format(now, 'yyyy-MM-dd');
            const formattedTime = format(now, 'HH:mm:ss');
            let body = req.body as IOrderWithDetail;
            console.log(body);
            session.startTransaction();
            let order = await new Order(
                {orderID:body.orderID,date:formattedDate,studentID:body.studentID,
                    time:formattedTime}).save();
            body.orderDetail.forEach(e=>{
               e.orderID=order.id;
            }   );
            await OrderDerail.insertMany(body.orderDetail);
            await session.commitTransaction();
            await session.endSession();
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:order});
        } catch (e) {
            console.log('tran failed')
            await session.abortTransaction();
            await session.endSession();
            next(e);
        }

    }
    searchOrder:RequestHandler=async (req, res:Response<IAppResponse<any>>, next)=>{
        try {
            let _id = req.params['_id'];
            console.log(_id)
            const order_id = new Types.ObjectId(_id);
            let iOrders = await  Order.aggregate([
                {$match: {_id:order_id}},
                {
                    $lookup: {
                        from:'orderdetails',
                        localField:'_id',
                        foreignField:'orderID',
                        as:'orderDetails',
                    },

                },
                { $unwind: '$orderDetails' },
                {
                    $lookup:{
                        from:'books',
                        localField: 'orderDetails.bookID',
                        foreignField: '_id',
                        as:'books'

                    }

                },
                { $unwind: '$books' },
                {
                    $addFields: {
                        "orderDetails.bookAmount": {
                            $multiply: ["$orderDetails.qty", "$books.price"]
                        }
                    }
                },
                {
                    $group:{
                        _id:'$_id',
                        orderID: { $first: '$orderID' },
                        studentID: { $first: '$studentID' },
                        date: { $first: '$date' },
                        time: { $first: '$time' },
                        totalAmount: { $sum: '$orderDetails.bookAmount' },
                        orderDetails:{
                            $push:{
                                _id: '$orderDetails._id',
                                qty: '$orderDetails.qty',
                                book:'$books'
                            }
                        }
                    }
                }

            ]).exec();
            console.log(iOrders);
            return res.status(200).json({message:'success',status:ResponseCode.SUCCESS,content:iOrders});
        }catch (e){
            next(e);
        }


    }
}
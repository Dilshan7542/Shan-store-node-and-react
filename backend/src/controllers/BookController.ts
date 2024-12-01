/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/25/2024
 */
import {RequestHandler,Response,Request} from "express";
import {Book, IBook} from "../models/Book";
import {IAppResponse} from "../interfaces/IAppResponse";
import {IOrder, Order} from "../models/Order";
import {Types} from 'mongoose';
import {ResponseCode} from "../constant/ResponseCode";

export class BookController{
    saveBook:RequestHandler=async (req, res, next)=>{
        try {
            let body = req.body as IBook;
            let newVar =await new Book<IBook>(body).save();
            return res.status(200).json({message:'success',status: ResponseCode.SUCCESS,body:newVar});

        }catch (e){
            next(e);
        }
    }
    getAllBookList:RequestHandler=async (req, res:Response<IAppResponse<IBook[]>>, next)=>{
        try {
            let bookList = await Book.find<IBook>().exec();
            return res.status(200).json({status: "R000",message:'success',content:bookList});
        }catch (e){
                next(e);
        }
    }
    getAllBookByStudentRefId:RequestHandler=async (req, res: Response<IAppResponse<any>>, next)=>{
        try {
        let studentID = req.params['studentID'];
            const studentObjectId = new Types.ObjectId(studentID);
        let iOrders = await  Order.aggregate([
            {$match: {studentID:studentObjectId}},
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
            return res.status(200).json({message:'success',status: ResponseCode.SUCCESS,content:iOrders});
        }catch (e){
            next(e);
        }
    }

}
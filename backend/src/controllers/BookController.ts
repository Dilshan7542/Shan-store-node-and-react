/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/25/2024
 */
import {RequestHandler,Response,Request} from "express";
import {Book, IBook} from "../models/Book";
import {IAppResponse, Pagination} from "../interfaces/IAppResponse";
import {IOrder, Order} from "../models/Order";
import {Types} from 'mongoose';
import {ResponseCode} from "../constant/ResponseCode";
import {ParamsDictionary} from "express-serve-static-core";
import {ResponseParam} from "../constant/AppConstant";
import {IStudent, Student} from "../models/Student";
import {IStudentResponse} from "./StudentController";
export interface IBookResponse extends Pagination{
    bookList:IBook[]
}
export class BookController{
    saveBook:RequestHandler=async (req, res, next)=>{
        try {
            let body = req.body as IBook;
            const lastBook = await Book.find<IBook>().sort({ bookID: -1 }).limit(1).exec();
            console.log(lastBook[0].bookID);
            let generateID="0";
            if(lastBook.length>0){
                generateID=(+lastBook[0].bookID +2)+"";
            }
            body.bookID=generateID;
            await new Book<IBook>(body).save();
            let iBookResponse = await this.getAllBookHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:iBookResponse});
        }catch (e){
            next(e);
        }
    }
    updateBook: RequestHandler = async (req, res: Response<IAppResponse<IBookResponse>>, next) => {
        try {
            const book = req.body as IBook;
            const query = await Book.findByIdAndUpdate(book._id, book, {
                new: true,
                runValidators: true
            });
            let iBookResponse = await this.getAllBookHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:iBookResponse});
        } catch (e) {
            next(e);
        }
    }
    getAllBookList:RequestHandler=async (req, res:Response<IAppResponse<IBookResponse>>, next)=>{
        try {
            let iBookResponse = await this.getAllBookHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:iBookResponse});
        }catch (e){
                next(e);
        }
    }

    async getAllBookHandler(param:ParamsDictionary) {
        try {
            const pageNo=+ param[ResponseParam.PAGE_NO] ||1;
            let pageSize=+ param[ResponseParam.ROW_COUNT] || 10;

            pageSize=pageSize < 20 ? pageSize:20;
            let totalBook = await Book.countDocuments().exec();
            const totalPage=Math.ceil(totalBook/pageSize);
            if(pageNo>totalPage || pageNo<1){
                throw new Error("Invalid Page Number");
            }

            const bookList = await Book.find<IBook>().skip((pageNo-1)*pageSize).sort({_id:-1}).limit(pageSize).exec();
            return {
                bookList:bookList,
                totalPage:totalPage,
                rowCount:pageSize,
                totalRecode:totalBook,
                pageNo:pageNo
            } as IBookResponse;

        } catch (e) {
            throw e;
        }
    }
    deleteBook: RequestHandler = async (req, res, next) => {
        try {
            const book = await Book.findOne<IStudent>({_id: req.params['_id']});
            if (!book) {
                return res.status(404).json({success: false, message: "Book not found"});
            }
            await book.deleteOne();
            let iBookResponse = await this.getAllBookHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:iBookResponse});
        } catch (error) {
            next(error); // Pass errors to the global error handler
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
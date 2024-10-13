/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/7/2024
 */
import {Request, RequestHandler, Response} from "express";
import {Student, IStudent} from "../models/Student";
import {IAppResponse} from "../interfaces/IAppResponse";
import mongoose from "mongoose";
import tryCatch from "../util/try-catch";

export class CustomerController {
    getAllCustomer: RequestHandler = tryCatch(async (req: Request, resp: Response) => {
        let customerList = await Student.find<IStudent>().exec();
        return this.customerSuccess(resp, customerList);
    });
    findByIdCustomer: RequestHandler = tryCatch(async (req: Request, resp: Response) => {
            let customerID = req.params['customerID'];
            let customer = await Student.findById<IStudent>(customerID).exec();
            if (customer) {
                return this.customerSuccess(resp, customer);
            }
    });
    saveCustomer: RequestHandler = async (req: Request, res: Response<IAppResponse<any>>, next) => {
        let clientSession = await mongoose.startSession();
        try {
            clientSession.startTransaction();
            let customer = req.body as IStudent;
            if (customer) {
                let customer1 = new Student({...customer});
                await customer1.save();
                await clientSession.commitTransaction();
                await clientSession.endSession();
                return this.customerSuccess<IStudent>(res, customer);
            }
        } catch (error) {
            if (clientSession) {
                try {
                    await clientSession.abortTransaction();
                } catch (abortError) {
                    console.log('transaction abort failed');
                }
            }
            next(error);
        }
    }
    updateCustomer: RequestHandler = async (req, res, next) => {
        let session = await mongoose.startSession();
        let customer = req.body as IStudent;
            session.startTransaction();
        let query = await Student.findById(customer.id);
        if (query) {

        }
    }

    customerSuccess<T>(resp: Response<IAppResponse<T>>, body: T) {
        return resp.status(200).json({message: 'success', body: body, status: 200});
    }

}
/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/14/2024
 */
import {NextFunction, Request, RequestHandler, Response, Router} from "express";
import {IAppResponse} from "../interfaces/IAppResponse";
import {ResponseCode} from "../constant/ResponseCode";
export interface IAppError extends Error{
    status:number
}

export const errorHandler=(err:IAppError,req:Request,resp:Response<IAppResponse<null>>,next:NextFunction)=>{
    console.log(err.stack);
    const status =ResponseCode.NO_DATA_FOUND;
        const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return resp.status(statusCode).json({content:null,message:message,status});
}
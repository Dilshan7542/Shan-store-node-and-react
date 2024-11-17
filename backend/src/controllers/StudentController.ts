/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import {RequestHandler,Response} from "express";
import {IStudent, Student} from "../models/Student";
import {IAppResponse} from "../interfaces/IAppResponse";
import {ResponseCode} from "../constent/ResponseCode";

export class StudentController {
    saveStudent:RequestHandler=async (req, res:Response<IAppResponse<IStudent>>, next)=>{
                try {
                    let body = req.body as IStudent;
                    let newVar:IStudent = await new Student<IStudent>(body).save();
                        res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:newVar});
                }catch (e){
                    next(e);
                }
    }
    searchStudentByRefId:RequestHandler=async (req, res:Response<IAppResponse<IStudent | null>>, next)=>{
        try {
                  const student = await  Student.findOne<IStudent>({_id:req.params['_id']});
                      return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:student});

        }catch (e){
            next(e);
        }
    }
    getAllStudent:RequestHandler=async (req, res:Response<IAppResponse<IStudent[] | null>>, next)=>{
        try {
            let studentList =await Student.find<IStudent>().exec();
            return res.status(200).json({status: ResponseCode.SUCCESS,message:'success',content:studentList});
        }catch (e){
            next(e);
        }
    }
    updateStudent:RequestHandler=async (req, res:Response<IAppResponse<IStudent | null>>, next)=>{}
    deleteStudent:RequestHandler=async (req, res, next)=>{

    }

}
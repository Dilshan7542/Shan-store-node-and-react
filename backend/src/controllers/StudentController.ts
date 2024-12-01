/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import {NextFunction, RequestHandler, Response} from "express";
import {IStudent, Student} from "../models/Student";
import {IAppResponse, Pagination} from "../interfaces/IAppResponse";
import {ResponseCode} from "../constant/ResponseCode";
import {AppConstant, ResponseParam} from "../constant/AppConstant";
import {ParamsDictionary} from "express-serve-static-core";

export interface IStudentResponse extends Pagination{
    studentList:IStudent[]
}
export class StudentController {
    saveStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudentResponse>>, next) => {
        try {
            let body = req.body as IStudent;
            await new Student<IStudent>(body).save();

       //  await   Student.insertMany(req.body);
            const iStudentResponse = await this.getAllStudentHandler(req.params);
            res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: iStudentResponse});
        } catch (e) {
            next(e);
        }
    }

    searchStudentByRefId: RequestHandler = async (req, res: Response<IAppResponse<IStudent | null>>, next) => {
        try {
            const student = await Student.findOne<IStudent>({_id: req.params[ResponseParam.ID]});
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: student});

        } catch (e) {
            next(e);
        }
    }
    getAllStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudentResponse | null>>, next) => {
        try {

            const iStudentResponse = await this.getAllStudentHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: iStudentResponse});
        } catch (e) {
            next(e);
        }
    }

    async getAllStudentHandler(param:ParamsDictionary) {
        try {
            const pageNo=+ param[ResponseParam.PAGE_NO] ||1;
            let pageSize=+ param[ResponseParam.ROW_COUNT] || 10;
            pageSize=pageSize < 20 ? pageSize:20;
            let totalStudent = await Student.countDocuments().exec();
            const totalPage=Math.ceil(totalStudent/pageSize);
            if(pageNo>totalPage || pageNo<1){
                throw new Error("Invalid Page Number");
            }
             const studentList = await Student.find<IStudent>().skip((pageNo-1)*pageSize).limit(pageSize).exec();
            return {
                studentList:studentList,
                totalPage:totalPage,
                rowCount:pageSize,
                totalRecode:totalStudent,
                pageNo:pageNo
            } as IStudentResponse;

        } catch (e) {
          throw e;
        }
    }

    updateStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudentResponse>>, next) => {
        try {
            const student = req.body as IStudent;
            const query = await Student.findByIdAndUpdate(student._id, student, {
                new: true,
                runValidators: true
            });
            const iStudentResponse = await this.getAllStudentHandler(req.params);
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: iStudentResponse});
        } catch (e) {
            next(e);
        }
    }
    deleteStudent: RequestHandler = async (req, res, next) => {
        try {
            const student = await Student.findOne<IStudent>({_id: req.params['_id']});
            if (!student) {
                return res.status(404).json({success: false, message: "Student not found"});
            }
            await student.deleteOne();
            const studentList = await this.getAllStudentHandler(req.params);
            return res.status(200).json({
                status: ResponseCode.SUCCESS,
                message: 'Student deleted successfully',
                content: studentList
            });
        } catch (error) {
            next(error); // Pass errors to the global error handler
        }
    }

}
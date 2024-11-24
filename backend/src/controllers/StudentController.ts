/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import {RequestHandler, Response} from "express";
import {IStudent, Student} from "../models/Student";
import {IAppResponse} from "../interfaces/IAppResponse";
import {ResponseCode} from "../constent/ResponseCode";

export class StudentController {
    saveStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudent[]>>, next) => {
        try {
            let body = req.body as IStudent;
            await new Student<IStudent>(body).save();
            const studentList = await this.getAllStudentHandler();
            res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: studentList});
        } catch (e) {
            next(e);
        }
    }
    searchStudentByRefId: RequestHandler = async (req, res: Response<IAppResponse<IStudent | null>>, next) => {
        try {
            const student = await Student.findOne<IStudent>({_id: req.params['_id']});
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: student});

        } catch (e) {
            next(e);
        }
    }
    getAllStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudent[] | null>>, next) => {
        try {

            let studentList = await this.getAllStudentHandler();
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: studentList});
        } catch (e) {
            next(e);
        }
    }

    async getAllStudentHandler() {
        try {
            return await Student.find<IStudent>().exec();
        } catch (e) {
            throw e;
        }
    }

    updateStudent: RequestHandler = async (req, res: Response<IAppResponse<IStudent[]>>, next) => {
        try {
            const student = req.body as IStudent;
            const query = await Student.findByIdAndUpdate(student._id, student, {
                new: true,
                runValidators: true
            });
            const studentList = await this.getAllStudentHandler();
            return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: studentList});
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
            const studentList = await this.getAllStudentHandler();
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
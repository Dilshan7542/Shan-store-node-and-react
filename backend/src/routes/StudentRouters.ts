/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/8/2024
 */
import {CustomerController} from "../controllers/CustomerController";
import express, {Router} from "express";
import {StudentController} from "../controllers/StudentController";

export default class StudentRouters {
          private router=Router();
           private studentController=new StudentController();

    constructor() {

        this.configRoute();
    }

    private configRoute(){
                this.router.get("/:pageNo",this.studentController.getAllStudent);
                this.router.get('/search/:_id',this.studentController.searchStudentByRefId);
                this.router.post('/:pageNo',this.studentController.saveStudent);
                this.router.put('/:pageNo',this.studentController.updateStudent);
                this.router.delete('/:_id/:pageNo',this.studentController.deleteStudent);
            }
            getRoute(){
        return this.router;
            }
}
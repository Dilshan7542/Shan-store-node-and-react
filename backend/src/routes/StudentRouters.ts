/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/8/2024
 */
import {CustomerController} from "../controllers/CustomerController";
import express, {Router} from "express";
import {StudentController} from "../controllers/StudentController";
import {AuthController} from "../controllers/AuthController";

export default class StudentRouters {
          private router=Router();
  private auth=new AuthController();
           private studentController=new StudentController();

    constructor() {

        this.configRoute();
    }

    private configRoute(){
                this.router.get("/:rowCount/:pageNo",this.auth.validateToken,this.studentController.getAllStudent);
                this.router.get('/search/:_id',this.auth.validateToken,this.studentController.searchStudentByRefId);
                this.router.post('/:rowCount',this.studentController.saveStudent);
                this.router.post('/search/sort',this.auth.validateToken,this.studentController.sortStudentController);
                this.router.put('/:rowCount',this.auth.validateToken,this.studentController.updateStudent);
                this.router.delete('/:rowCount/:_id',this.auth.validateToken,this.studentController.deleteStudent);
            }
            getRoute(){
        return this.router;
            }
}

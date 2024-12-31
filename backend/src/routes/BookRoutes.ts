import {Router} from "express";
import {BookController} from "../controllers/BookController";
import {AuthController} from "../controllers/AuthController";
import {UserRole} from "../models/User";

/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/25/2024
 */
export class BookRoutes{
   private router= Router();
   private bookController=new BookController();
private auth=new AuthController();
    constructor() {
        this.configRoute();
    }

    private configRoute() {
        this.router.get('/:rowCount/:pageNo',this.bookController.getAllBookList);
      this.router.put('/:rowCount',this.auth.validateToken,this.auth.checkRole([UserRole.ADMIN]),this.bookController.updateBook);
      this.router.delete('/:rowCount/:_id',this.auth.validateToken,this.auth.checkRole([UserRole.ADMIN]),this.bookController.deleteBook);
        this.router.get('/studentId/:studentID',this.auth.validateToken,this.bookController.getAllBookByStudentRefId);
        this.router.post('/:rowCount',this.auth.validateToken,this.bookController.saveBook);
    }
    getRoutes(){
       return  this.router;
    }
}

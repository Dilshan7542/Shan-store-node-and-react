import {Router} from "express";
import {BookController} from "../controllers/BookController";

/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/25/2024
 */
export class BookRoutes{
   private router= Router();
   private bookController=new BookController();

    constructor() {
        this.configRoute();
    }

    private configRoute() {
        this.router.get('/:rowCount/:pageNo',this.bookController.getAllBookList);
      this.router.put('/:rowCount',this.bookController.updateBook);
        this.router.get('/studentId/:studentID',this.bookController.getAllBookByStudentRefId);
        this.router.post('/:rowCount',this.bookController.saveBook);
    }
    getRoutes(){
       return  this.router;
    }
}
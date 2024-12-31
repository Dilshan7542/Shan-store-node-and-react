import {Router} from "express";
import {BookController} from "../controllers/BookController";
import {AuthController} from "../controllers/AuthController";
import {UserRole} from "../models/User";

export class AuthRoutes {
  private router= Router();
  private auth=new AuthController();
  constructor() {
    this.configRoute();
  }
  private configRoute() {
    this.router.get('/:rowCount/:pageNo',this.auth.loginUser);
  }
  getRoutes(){
    return  this.router;
  }
}

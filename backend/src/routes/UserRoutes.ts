import {UserController} from "../controllers/UserController";
import {AuthController} from "../controllers/AuthController";
import {Router} from "express";
import {UserRole} from "../models/User";

export default class UserRoutes{
private userController=new UserController();
private auth=new AuthController();
  private router=Router();
  constructor() {
    this.configRoutes();
  }
  configRoutes(){
    this.router.post("/:rowCount",
      this.auth.validateToken,this.auth.checkRole([UserRole.MANAGER]),this.userController.saveUser);
    this.router.post("/auth/dev",this.userController.saveUser);
    this.router.post("/auth/login",this.auth.loginUser);
    this.router.put("/:rowCount",
      this.auth.validateToken,this.auth.checkRole([UserRole.MANAGER]),this.userController.updateUser)
  }
  getRoutes(){
    return this.router;
  }
}

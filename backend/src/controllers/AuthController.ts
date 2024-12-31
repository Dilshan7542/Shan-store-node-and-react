import * as JWT from "jsonwebtoken";
import {RequestHandler} from "express";
import {User} from "../models/User";


export class AuthController {
  jwtsecret = process.env.JWT_SECRET!;
  generateToken = (_id:string,role:string) => {
    let s = JWT.sign({
      id: _id,
      role: role
    }, this.jwtsecret);
  }
validateToken:RequestHandler=async (req, res, next)=>{
    const header = req.header("Authorization");
    if(header && header.startsWith("Bearer") && header.length> 20){
    const verify = JWT.verify(header,this.jwtsecret) as {id:string,role:string};
    try {
      const user = await User.findById(verify.id).exec();
      // @ts-ignore

      }catch (e){
      console.error("Token validation error:");
      return next();
    }
    }
}
 checkRole = (requiredRoles: string[]): RequestHandler => {
    return (req, res, next) => {

      // @ts-ignore
      const userRole = req.user?.role;

      if (!userRole || !requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next();
    };
  };

}

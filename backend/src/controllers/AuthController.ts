import * as JWT from "jsonwebtoken";
import {RequestHandler} from "express";
import {IUser, User, UserRole} from "../models/User";
import {ResponseCode} from "../constant/ResponseCode";
interface AuthUser{
  _id:string,role:UserRole
}

export class AuthController {
  jwtsecret = process.env.JWT_SECRET!;
  generateToken = (auth:AuthUser) => {
    return  JWT.sign(auth, this.jwtsecret,{expiresIn:"1d"});
  }
validateToken:RequestHandler=async (req, res, next)=>{
    const header = req.header("Authorization");
    if(header && header.startsWith("Bearer") && header.length> 20){
    const verify = JWT.verify(header,this.jwtsecret) as AuthUser;
    try {
      const user = await User.findById(verify._id).exec();
      if(user){
      // @ts-ignore
      req.user={
        _id:user._id,
        role:user.role
      } as AuthUser;
      }
      next();
      }catch (e){
      return res.status(401).json({content:null,message:"Unauthorized access",status:ResponseCode.UNAUTHORIZED});
    }
    }
}
 checkRole  (requiredRoles: UserRole[]): RequestHandler {
    return  (req, res, next) => {
      // @ts-ignore
      const authUser = req.user as AuthUser;
     if(!requiredRoles.includes(authUser.role)){
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
     }
      return next();
    };
  };
 loginUser:RequestHandler=async (req, res, next)=>{
   const userBody = req.body as IUser;
   let newUser = await User.create(userBody);
 return "";
}
}

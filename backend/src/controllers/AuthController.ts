import * as JWT from "jsonwebtoken";
import {RequestHandler, Response} from "express";
import {User, UserRole} from "../models/User";
import {ResponseCode} from "../constant/ResponseCode";
import {Bcrypt} from "../util/Bcrypt";
import {IAppResponse} from "../interfaces/IAppResponse";
import {config} from "dotenv";
config();
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
  console.log(header)
    if(header && header.startsWith("Bearer") && header.length> 20){
    const verify = JWT.verify(header.substring(7),this.jwtsecret) as AuthUser;
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
      return res.status(401).json({content:null,message:"Access Denied: insufficient permissions",status:ResponseCode.UNAUTHORIZED});
    }
    }else{
      next(new Error("Access Denied: insufficient permissions"))
    }
}
 checkRole(requiredRoles: UserRole[]): RequestHandler {
    requiredRoles.push(UserRole.MANAGER);
    return  (req, res:Response<IAppResponse<null>>, next) => {
      // @ts-ignore
      const authUser = req.user as AuthUser;
      console.log(authUser);
     if(!requiredRoles.includes(authUser.role)){
        return res.status(403).json({ message: "Access denied: insufficient permissions" ,status:ResponseCode.UNAUTHORIZED,content:null});
     }
      return next();
    };
  };
 loginUser:RequestHandler=async (req, res:Response<IAppResponse<{ token: string,name:string,role:string }>>, next)=>{
   const credential = req.body as {name:string,password:string};
   try {
     let user = await User.findOne({name:credential.name});
     if(user){
       if (await Bcrypt.comparePassword(credential.password, user.password)) {
        return res.status(200).json({
            message: "Success",
            status:ResponseCode.SUCCESS,
            content:{
              token: this.generateToken({_id:user._id,role:user.role}),
              name:user.name,
              role:user.role
            }});
       }else{
        return  next(new Error("Invalid Password"))
       }
     }
   }catch (e){
    return  next(e);
   }
}
}

import {RequestHandler} from "express";
import {IUser, User} from "../models/User";
import {ResponseCode} from "../constant/ResponseCode";
import {Bcrypt} from "../util/Bcrypt";
import {NextFunction, Response} from "express";
import {IAppResponse} from "../interfaces/IAppResponse";
export class UserController{
saveUser:RequestHandler=async (req, res:Response<IAppResponse<any>>, next)=>{
    console.log(req);
  try {
    const body = req.body as IUser;
    body.password = await Bcrypt.hashPassword(body.password);
      const newVar = await new User<IUser>(body).save();
      newVar.password="";
  return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: newVar});
  }catch (e){
   next();
  }
}
  updateUser:RequestHandler=async (req, res, next)=>{
    try {
      const userBody = req.body as IUser;
      let query = await User.findByIdAndUpdate<IUser>(userBody._id,userBody,{
        new:true,
        runValidators:true
      }).exec();
      return res.status(200).json({status: ResponseCode.SUCCESS, message: 'success', content: query});
    }catch (e){
      next();
    }
  }

}

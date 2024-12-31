import mongoose, {Document, Schema} from "mongoose";
 enum UserRole{
  MANAGER="MANAGER",ADMIN="ADMIN"
}
interface IUser extends Document {
  name: string;
  role: UserRole;
  password:string
}
const userSchema = new Schema<IUser>({
  name:{
    required:true,
    type:String,
  },
  password:{
required:true,
    type:String
  },
  role:{
    type:String,
    required:true,
    enum:UserRole,
    default:UserRole.ADMIN
  }
});
const User = mongoose.model<IUser>("User",userSchema);
export {User,UserRole,IUser}

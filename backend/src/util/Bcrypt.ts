import bcrypt from "bcrypt";
export class Bcrypt {
  static async hashPassword (pwd:string){
      const saltRounds = 10;
         return  await bcrypt.hash(pwd,saltRounds);

  }
  static async comparePassword(pwd:string,hashPwd:string){
   return  await bcrypt.compare(pwd,hashPwd);
  }
}

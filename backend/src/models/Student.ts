import mongoose, { Document, Schema, model } from "mongoose";

interface IStudent extends Document {
    studentID:string;
    name: string;
    address: string;
    phone: string;
    age: number;
}

const studentSchema = new Schema<IStudent>({
    studentID:{
      type:String,
      required:false
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true, // Assuming phone numbers should be unique
    },
    age: {
        type: Number,
        required: true,
    },

});
const Student= mongoose.model<IStudent>('Student', studentSchema);

export { Student ,IStudent};
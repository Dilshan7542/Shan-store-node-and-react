/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/21/2024
 */
import mongoose, {Document, Schema} from "mongoose";

     interface IBook extends Document {
        bookID: string;
        name: string;
        author: string;
        description: string;
        price: number;
    }
const bookSchema=new Schema<IBook>({
    bookID: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});
const Book=mongoose.model<IBook>('Book',bookSchema);

export {Book,IBook};

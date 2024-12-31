/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/7/2024
 */
import express from 'express';
import db from 'mongoose';
import {config} from 'dotenv';
import cors from 'cors';
import {json, urlencoded} from "body-parser";
import {errorHandler} from "./middleware/ErrorHandler";
import routers from "./routes/AppRoutes";
import {AuthController} from "./controllers/AuthController";

config();

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({extended:true}));
app.use('/',routers);
app.use(errorHandler);
if(process.env.DB_URL) {
    db.connect(process.env.DB_URL).then(resp => {
        console.log('database is connected');
        app.listen(process.env.SERVER_PORT, () => {
            console.log('Connected PORT : '+process.env.SERVER_PORT);
        });

    }).catch(er => {
        console.log('error connecting DB',er);
    })
}

/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/17/2024
 */
import {NextFunction, Request, Response} from "express";

const tryCatch = (controller: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller(req, res);
    } catch (er) {
        console.log(er)
        return next(er);
    }
}
export default tryCatch;
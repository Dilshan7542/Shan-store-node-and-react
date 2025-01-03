/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/14/2024
 */
import {Router} from "express";
import StudentRouters from "./StudentRouters";
import {BookRoutes} from "./BookRoutes";
import {OrderRoutes} from "./OrderRoutes";
import UserRoutes from "./UserRoutes";


 let router = Router();
const urlPrefix='/api/v1';
router.use(urlPrefix+'/student',new StudentRouters().getRoute());
router.use(urlPrefix+'/book',new BookRoutes().getRoutes());
router.use(urlPrefix+'/order',new OrderRoutes().getRoutes());
router.use(urlPrefix+'/user',new UserRoutes().getRoutes());

export default router;


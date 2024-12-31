/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/15/2024
 */
import {OrderController} from "../controllers/OrderController";
import {Router} from "express";
import {AuthController} from "../controllers/AuthController";

export class OrderRoutes{
    private router=Router();
     private  orderController=new OrderController();
private auth=new AuthController();
    constructor() {
        this.configRoute();
    }

    private configRoute() {
        this.router.get('/',this.auth.validateToken,this.orderController.getOrderList);
        this.router.get('/:orderID',this.auth.validateToken,this.orderController.getOrderList);
        this.router.get('/search/:_id',this.auth.validateToken,this.orderController.searchOrder);
        this.router.post('/',this.auth.validateToken,this.orderController.saveOrder);
    }
    getRoutes(){
        return this.router;
    }
}

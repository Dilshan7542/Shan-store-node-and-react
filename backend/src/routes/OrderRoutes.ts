/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/15/2024
 */
import {OrderController} from "../controllers/OrderController";
import {Router} from "express";

export class OrderRoutes{
    private router=Router();
     private  orderController=new OrderController();

    constructor() {
        this.configRoute();
    }

    private configRoute() {
        this.router.get('/',this.orderController.getOrderList);
        this.router.get('/:orderID',this.orderController.getOrderList);
        this.router.get('/search/:_id',this.orderController.searchOrder);
        this.router.post('/',this.orderController.saveOrder);
    }
    getRoutes(){
        return this.router;
    }
}
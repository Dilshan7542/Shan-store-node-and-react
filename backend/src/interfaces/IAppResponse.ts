/**
 @author  :Dilshan Maduranga
 @project :point-of-sale-node
 @date    :7/14/2024
 */

export interface IAppResponse<T>{
    message:string | 'success' | 'error';
    status:string;
    content:T;
}
export interface Pagination{
    rowCount:number;
    totalPage:number;
    totalRecode:number;
    pageNo:number;
}


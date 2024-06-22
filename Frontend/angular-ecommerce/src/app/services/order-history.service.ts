import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl='http://localhost:8080/api/orders';

  constructor(private httpClient:HttpClient) {}

  getOrdeHistory(theEmail:string):Observable<GetOrderHistoryResponse>{
       //need to build URL based on the email
       const orderHistoryUrl=`${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;

       return this.httpClient.get<GetOrderHistoryResponse>(orderHistoryUrl);
  }

}


interface GetOrderHistoryResponse{
  _embedded:{
    orders:OrderHistory[];
  }
}

import { Address } from "./address";
import { Customer } from "./customer";
import { OrderItem } from "./order-item";
import { Orders } from "./orders";

export class Purchase {
            customer: Customer=new Customer();
            shippingAddress: Address=new Address();
            billingAddress: Address=new Address();
            orders: Orders=new Orders();
            orderItems: OrderItem[]=[];
}

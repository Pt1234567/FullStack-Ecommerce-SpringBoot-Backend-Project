import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{

  cartItems:CartItem[]=[];

  totalQuantity:number=0;
  totalPrice:number=0.00;

  constructor(private cartSevice:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }


  listCartDetails() {
      //get a handle to cart items
      this.cartItems=this.cartSevice.cartItem;

      //subscribe to cart total price
      this.cartSevice.totalPrice.subscribe(
        data=>{
          this.totalPrice=data;
        }
      )

      //subscribe to cart total quantity
      this.cartSevice.totalQuantity.subscribe(
        data=>{
          this.totalQuantity=data;
        }
      )

      //compute cart total price and quantity
      this.cartSevice.computeCartTotals();
  }

  incrementQuantity(theCartItem:CartItem){
    this.cartSevice.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem:CartItem){
    this.cartSevice.decrementQuantity(theCartItem);
  }

  removeItem(theCartItem:CartItem){
    this.cartSevice.remove(theCartItem);
  }

}

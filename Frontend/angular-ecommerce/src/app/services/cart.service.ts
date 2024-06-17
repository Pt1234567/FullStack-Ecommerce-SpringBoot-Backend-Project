import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  

  cartItem:CartItem[]=[];

  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

  constructor() { }


  addToCart(theCartItem:CartItem){
     //check if we already have the item in our cart
      let alreadyExistsInCart:boolean=false;
      let existingCartItem:CartItem | null =null;


      if(this.cartItem.length>0){

        for(let tempCartItem of this.cartItem){
          if(tempCartItem.id===theCartItem.id){
            existingCartItem=tempCartItem;
            break;
          }
        }
        
      }

    alreadyExistsInCart=(existingCartItem!=null);

    if(alreadyExistsInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItem.push(theCartItem);
    }


   this.computeCartTotals();

  }


  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    for(let tempCartItem of this.cartItem){
      totalPriceValue+=tempCartItem.quantity*tempCartItem.unitPrice;
      totalQuantityValue+=tempCartItem.quantity;
    }


    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  
  decrementQuantity(theCartItem: CartItem) {
     theCartItem.quantity--;
     
     if(theCartItem.quantity==0){
      this.remove(theCartItem);
     }else{
      this.computeCartTotals();
     }
  }
  remove(theCartItem: CartItem) {
      //get index of item in the array

      const itemIndex=this.cartItem.findIndex(tempCartItem=>tempCartItem.id==theCartItem.id);
      //if found, remove the item from the array at the given index

      if(itemIndex>-1){
        this.cartItem.splice(itemIndex,1);
        this.computeCartTotals();
      }
  }
}

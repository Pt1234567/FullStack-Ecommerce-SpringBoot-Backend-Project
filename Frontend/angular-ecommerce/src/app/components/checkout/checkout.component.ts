import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { OrderItem } from 'src/app/common/order-item';
import { Orders } from 'src/app/common/orders';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutService } from 'src/app/services/check-out.service';
import { ShoppingFormService } from 'src/app/services/shopping-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  states: State[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkOutFormGroup: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder,
              private cartService:CartService, 
              private shoppingFormService: ShoppingFormService,
              private checkOutService:CheckOutService,
              private router:Router) { }

  ngOnInit(): void {

     this.reviewCartDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.email, ShopValidators.notOnlyWhitespace])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6), ShopValidators.notOnlyWhitespace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6), ShopValidators.notOnlyWhitespace])
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOncard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })

    });


    const startMonth: number = new Date().getMonth() + 1;

    this.shoppingFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    this.shoppingFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.shoppingFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data=>this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity=data
    );

  }

  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }


  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }


  get creditCardCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOncard'); }
  get creditCardCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkOutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkOutFormGroup.get('creditCard.expirationYear'); }


  copyShippingToBilling($event: Event) {
    if (($event.target as HTMLInputElement).checked) {
      // Access 'billingAddress' using bracket notation
      this.checkOutFormGroup.controls['billingAddress'].setValue(this.checkOutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];

    }
  }


  onSubmit() {
   
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    // Set up order
    let order=new Orders();
    order.totalPrice=this.totalPrice;;
    order.totalQuantity=this.totalQuantity;

    //get cart items
    const cartItem=this.cartService.cartItem;

    //create orderItems from cartItems
    let orderItems:OrderItem[]=cartItem.map(tempCartItem=>new OrderItem(tempCartItem));
    //set up purchase
    let purchase:Purchase=new Purchase();

    //populate purchase - customer
    purchase.customer=this.checkOutFormGroup.controls['customer'].value;
    

    //populate purchase - shipping address
    purchase.shippingAddress=this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state=shippingState.name;  
    purchase.shippingAddress.country=shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress=this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state=billingState.name;  
    purchase.billingAddress.country=billingCountry.name;

    //populate purchase - order and orderItems
    purchase.orders=order;
    purchase.orderItems=orderItems;

    //call REST API via the CheckoutService

    this.checkOutService.placeOrder(purchase).subscribe(
        {
          next:response=>{
            alert(`Your order has been placed.\n Order tracking number: ${response.orderTrackingNumber}`);

            //reset cart
            this.resetCart();
          },
          error:err=>{
            alert(`There was an error: ${err.message}`);
          }
        }
    );
  
  
  }
  resetCart() {
     //reset cart data
      this.cartService.cartItem=[];
      this.cartService.totalPrice.next(0);
      this.cartService.totalQuantity.next(0);
      //reset the form
      this.checkOutFormGroup.reset();
      //navigate back to the products page
      this.router.navigateByUrl("/products");
  }


  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shoppingFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup!.value.country.code;

    this.shoppingFormService.getSates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
      }
    );

  }

}

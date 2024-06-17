import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
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

  constructor(private formBuilder: FormBuilder,private cartService:CartService, private shoppingFormService: ShoppingFormService) { }

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
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
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
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
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
    console.log("Handling the submit button");

    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
    }

    console.log(this.checkOutFormGroup.get('customer')?.value);
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

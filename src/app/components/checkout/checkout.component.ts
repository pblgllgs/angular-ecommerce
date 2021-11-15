import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { UtilValidators } from '../../validators/util-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice : number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries : Country[]= [];

  shippingAddressStates : State[]= []; 
  billingAddressStates : State[]= []; 

  constructor(private fb:FormBuilder,
              private utilsService:UtilsService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.fb.group({
      customer : this.fb.group({
        firstName:new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.fb.group({
        country: new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace])
      }),
      billingAddress : this.fb.group({
        country: new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace])
      }),
      creditCard : this.fb.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), UtilValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('',[Validators.required]),
        expirationYear: new FormControl('',[Validators.required]),
      })
    });

    //poblar el arrglo de meses

    const startMonth: number = new Date().getMonth() +1;

    this.utilsService.getCreditCardMonths(startMonth)
      .subscribe(data =>{
        this.creditCardMonths = data;
        console.log("Months: "+ JSON.stringify(data));
      });

    this.utilsService.getCreditCardYears()
      .subscribe(data =>{
        this.creditCardYears = data;
        console.log("Years: "+ JSON.stringify(data));
      });

    this.utilsService.getCountries()
      .subscribe(data => {
        console.log("The countries: "+ JSON.stringify(data));
        this.countries = data;
      }
     );
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country')}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state')}
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street')}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city')}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode')}

  get creditCardCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}



  onSubmit(){
    console.log("handling");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log("checkoutFormGroup is valid: "  + this.checkoutFormGroup.valid);
  }

  copyShippingAdressToBillingAdress(event: { target: { checked: any; }; }){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      
      //posible bug
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //posible bug
      this.billingAddressStates = [];
    }
  }

  handledMonthsAndYears(){
     const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

     const currentYear :  number = new Date().getFullYear();
     const selectedYear : number = Number(creditCardFormGroup?.value.expirationYear);

     //si el año actual es igual al año seleccionado entonces comienza con le mes actual
     let startMonth : number;

     if(currentYear === selectedYear){
      startMonth = new Date().getMonth() +1;
     }else{
       startMonth = 1;
     }

     this.utilsService.getCreditCardMonths(startMonth)
      .subscribe(data => {
        console.log("months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      })
  }

  getStates(formGroupName: string){
    const formGroup =  this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.utilsService.getStates(countryCode)
      .subscribe(data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else if(formGroupName === 'billingAddress'){
          this.billingAddressStates = data;
        }
        formGroup!.get('state')!.setValue(data[0]);
      });
  }





}

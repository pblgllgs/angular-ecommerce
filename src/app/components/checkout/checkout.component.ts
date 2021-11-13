import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
        firstName:[''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress : this.fb.group({
        country:[''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress : this.fb.group({
        country:[''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard : this.fb.group({
        cardType:[''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
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
     )
  }

  onSubmit(){
    console.log("handling");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  }

  copyShippingAdressToBillingAdress(event: { target: { checked: any; }; }){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      
      //posible bug
      //this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //posible bug
      //this.billingAddressState = [];
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
        }else{
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      });
  }





}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';

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
  }

  onSubmit(){
    console.log("handling");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  }

  copyShippingAdressToBillingAdress(event: { target: { checked: any; }; }){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
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

}

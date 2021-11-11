import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.fb.group({
      customer : this.fb.group({
        firstName:[''],
        lastNAme: [''],
        emial: ['']
      })
    })
  }

  

}

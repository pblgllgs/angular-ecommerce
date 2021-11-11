import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];
  totalPrice : Subject<number> =  new Subject<number>();
  totalQuantity : Subject<number> =  new Subject<number>();

  constructor() { }

  addTocart(theCartItem :CartItem){

    //revisamos si el item esta en el carro
    let alreadyExistInCart : boolean =  false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      alreadyExistInCart = (existingCartItem != undefined);
    }

    //buscar el item basado en la id
    if(alreadyExistInCart ){
      //aumentar la cantidad
      existingCartItem.quantity ++;
    }else{
      this.cartItems.push(theCartItem);
    }

    //calcular el total
    this.computeCartTotals();
  }

  remove(theCartItem :CartItem){
    //obtenemos el index del item en el arreglo
    const itemIndex = this.cartItems.findIndex(tempCartITem => tempCartITem.id == theCartItem.id);
    if(itemIndex >-1){
      //utilizamos el index para eliminar el item del arreglo de items
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(){
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;
    //recorremos y calculamos los subtotales
    for(let currentCartItem of  this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //debug
    this.logCartData(totalQuantityValue, totalPriceValue);

  }
  
  removeToCart(theCartItem: CartItem){
    theCartItem.quantity--;
    
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  
  logCartData(totalQuantityValue: number, totalPriceValue: number) {
    console.log('Contenido del carro');
    for(let tempCartItem of this.cartItems){
        const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
        console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotal: ${subTotalPrice}`)
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }
}
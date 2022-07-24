import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  cartItems = new Subject<any>();
  currCartItems: any =[];
  allCartItems: any =[];
  getCartItems = this.cartItems.asObservable();
  setCartItems(item){
    this.cartItems.next(item);
  }
  message = new Subject<any>();
  getMessage = this.message.asObservable();
  setMessage(item){
    this.message.next(item);
  }

  getCurrCartItems(){
    return this.currCartItems;
  }
  setCurrCartItems(item){
    this.currCartItems = item;
  }
  getAllCartItems(){
    return this.allCartItems;
  }
  setAllCartItems(item){
    this.allCartItems = item;
  }

  /**Check quantity of added items */
  checkQuantity(item: any){
    if(item){
      return item?.quantity > item?.addedQuantity;
    }else{
      return false;
    }
  }

  /**This method is used to check the currency */
  checkCurrency(currency: string){
    if(currency === 'INR'){
      return 'Rs.'
    }
    else{
      return '';
    }
  }

  constructor() { }
}

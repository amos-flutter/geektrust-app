import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any= [];
  cartCount: any = 0;

  constructor(public commonService: CommonService,private _snackBar: MatSnackBar,) {
    
  }

  ngOnInit(): void {
    this.commonService.setMessage({currentModule: 'cart'});
    this.cartItems = this.commonService.getAllCartItems();
    this.cartItems.forEach(element => {
      if(element?.addedQuantity > 0){
        this.cartCount += element?.addedQuantity;
      }
    });
  }

  changeQuantity(type: any, item: any, index: any){
    if(type === 'add'){
      if(this.commonService.checkQuantity(item)){
        this.cartCount +=1;
        this.cartItems[index].addedQuantity += 1;
        this.commonService.setCartItems(this.cartCount);
        this.commonService.setAllCartItems(this.cartItems);
      }else{
        this.showQuantityError();
      }
    }else if(type === 'delete' && item?.addedQuantity && item?.addedQuantity > 0){
      this.cartCount -= 1;
      this.cartItems[index].addedQuantity -= 1;
      this.commonService.setCartItems(this.cartCount);
      this.commonService.setAllCartItems(this.cartItems);
    }
  }

  deleteCartItem (item?: any, index?: any){
    this.cartCount -= item.addedQuantity;
    this.cartItems[index].addedQuantity = 0 ;
    this.commonService.setCartItems(this.cartCount);
      this.commonService.setAllCartItems(this.cartItems);
  }

  itemCartPrice(item: any){
    return item?.price*item?.addedQuantity;
  }

  totalCartPrice(){
    let total = 0;
    this.cartItems.forEach(element => {
      if(element.addedQuantity >0){
        total += element?.addedQuantity * element?.price;
      }
    });

    return total;
  }

  /**Show quantity Error */

  showQuantityError(){
    this._snackBar.open('No more quantity left', 'OK', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { MockApiResponse } from 'src/app/catalogue';
import { CommonService } from 'src/app/common.service';
import { RestService } from 'src/app/rest.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  filterObj = {
    colour: {
      red: false,
      blue: false,
      green: false,
    },
    gender: {
      men: false,
      women: false,
    },
    price: {
      min: false,
      intermediate: false,
      max: false,
    },
    type: {
      polo: false,
      hoodie: false,
      basic: false,
    }
  };
  defaultFilterObj = {
    colour: {
      red: false,
      blue: false,
      green: false,
    },
    gender: {
      men: false,
      women: false,
    },
    price: {
      min: false,
      intermediate: false,
      max: false,
    },
    type: {
      polo: false,
      hoodie: false,
      basic: false,
    }
  };
  mockApiResponse = MockApiResponse;
  search: string = '';
  productList: any;
  cartItems: any =0;
  productsToDisplay: any;
  showClearFilter = false;

  constructor(private _snackBar: MatSnackBar, private commonService: CommonService, private matDialog: MatDialog) { 
    this.commonService.setMessage({currentModule: 'products'});
  }

  ngOnInit(): void {
    this.productList=[];
    this.productsToDisplay = [];
    this.productList = this.commonService.getAllCartItems();
    this.productsToDisplay = this.commonService.getAllCartItems();
    if(this.productList?.length > 0){
      this.productList.forEach(element => {
        if(element?.addedQuantity > 0){
          this.cartItems += element?.addedQuantity;
        }
      });
    }else{
      this.getProducts();
    }
  }

  clearFilter(){
    this.filterObj = JSON.parse(JSON.stringify(this.defaultFilterObj));
    this.filterOrSearchItem();
  }

  /**Search for products */
  filterOrSearchItem(){
    let productsList = JSON.parse(JSON.stringify(this.productList));
    this.productsToDisplay = [];
    let filterCount =0;
    if(this.filterObj.colour.red || this.filterObj.colour.blue || this.filterObj.colour.green){
      this.productsToDisplay = this.filterColor(productsList, this.productsToDisplay);
      filterCount +=1;
    }
    if(filterCount > 0 && (this.filterObj.gender.men || this.filterObj.gender.women)){
      this.productsToDisplay = this.filterGender(this.productsToDisplay, []);
      filterCount +=1;
    }else if((this.filterObj.gender.men || this.filterObj.gender.women)){
      this.productsToDisplay = this.filterGender(productsList, this.productsToDisplay);
      filterCount +=1;
    }
    if(filterCount > 0 && (this.filterObj.type.polo || this.filterObj.type.hoodie || this.filterObj.type.basic)){
      this.productsToDisplay = this.filterType(this.productsToDisplay, []);
      filterCount +=1;
    }else if((this.filterObj.type.polo || this.filterObj.type.hoodie || this.filterObj.type.basic)){
      this.productsToDisplay = this.filterType(productsList, this.productsToDisplay);
      filterCount +=1;
    }
    if(filterCount > 0 && (this.filterObj.price.min|| this.filterObj.price.intermediate || this.filterObj.price.max)){
      this.productsToDisplay = this.filterPrice(this.productsToDisplay, []);
      filterCount +=1;
    }else if((this.filterObj.price.min|| this.filterObj.price.intermediate || this.filterObj.price.max)){
      this.productsToDisplay = this.filterPrice(productsList, this.productsToDisplay);
      filterCount +=1;
    }
    if(this.search.length > 0 && filterCount > 0 ){
      this.productsToDisplay = this.searchItems(this.productsToDisplay);
      filterCount +=1;
    }else if(this.search.length > 0){
      this.productsToDisplay = this.searchItems(this.productList);
      filterCount +=1;
    }
    if(filterCount === 0){
      this.productsToDisplay = this.productList;
      this.showClearFilter = false;
    }else{
      this.showClearFilter = true;
    }
    console.log(this.productsToDisplay)
  }

  filterColor(productsList,listToFilter){
    if(this.filterObj.colour.red){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.color?.toLowerCase() === 'red')];
    }
    if(this.filterObj.colour.blue){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.color?.toLowerCase() === 'blue')];
    } 
    if(this.filterObj.colour.green){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.color?.toLowerCase() === 'green')];
    } 
    return listToFilter;
  }
  filterGender(productsList,listToFilter){
    if(this.filterObj.gender.men){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.gender?.toLowerCase() === 'men')];
    } 
    if(this.filterObj.gender.women){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.gender?.toLowerCase() === 'women')];
    } 
    return listToFilter;
  }
  filterType(productsList,listToFilter){
    if(this.filterObj.type.polo){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.type?.toLowerCase() === 'polo')];
    } 
    if(this.filterObj.type.hoodie){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.type?.toLowerCase() === 'hoodie')];
    } 
    if(this.filterObj.type.basic){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.type?.toLowerCase() === 'basic')];
    } 
    return listToFilter;
  }
  filterPrice(productsList,listToFilter){
    if(this.filterObj.price.min){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.price <= 250)];
    } 
    if(this.filterObj.price.intermediate){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.price > 250 && x.price <= 450 )];
    } 
    if(this.filterObj.price.max){
      listToFilter = [...listToFilter, ...productsList.filter(x => x.price > 450)];
    } 
    return listToFilter;
  }
  searchItems(listToFilter){
    if(this.search.length >0){
      listToFilter = listToFilter.filter(x => x?.name.toLowerCase().includes(this.search?.toLowerCase()));
    } 
    return listToFilter;
  }

  /**Method to get all products */
  getProducts(){
    // let url ='https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json';
    of(this.mockApiResponse).subscribe((res: any) =>{
      if(res && res?.length >0){
        res.forEach(element => {
          element.addedQuantity = 0;
        });
      }
      this.productList = JSON.parse(JSON.stringify(res));
      this.productsToDisplay = JSON.parse(JSON.stringify(res));
    }); 
  }

  openFilterPopup(){
    const filterPopUp = this.matDialog.open(FilterComponent,{
      height: '100%',
      width: '100%',
      panelClass :'popUpClass',
      data: this.filterObj
    });
    filterPopUp.afterClosed().subscribe(res =>{
      if(res && res?.filter){
        this.filterObj = res?.filter;
        this.filterOrSearchItem();
      } else if(res && res?.clear){
        this.clearFilter();
      }
    });
  }


  /**This method is used to handle add to cart functionality */
  addToCart(item: any, index: any){
    let findIndex =  this.productList.findIndex(x => x?.id === item?.id);
    if(this.commonService.checkQuantity(this.productList[findIndex])){
      this.cartItems+=1;
      this.productList[findIndex].addedQuantity += 1;
      // let currCartItems = this.productList.filter(x => x.addedQuantity > 0);
      this.commonService.setCartItems(this.cartItems);
      this.commonService.setAllCartItems(this.productList);
    }else{
      this.showQuantityError();
    }
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

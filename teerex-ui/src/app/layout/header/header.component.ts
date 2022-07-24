import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isProductActive: boolean = true;
  isCartActive: boolean = false;
  totalCartItems: any = 0;

  constructor(private router: Router, private commonService: CommonService) {
    this.commonService.getCartItems.subscribe(items =>{
      this.totalCartItems = items;
    });
    this.commonService.getMessage.subscribe(res =>{
      if(res && res?.currentModule && res?.currentModule === 'products'){
        this.isProductActive = true;
        this.isCartActive = false;
      }else if(res && res?.currentModule && res?.currentModule === 'cart') {
        this.isProductActive = false;
        this.isCartActive = true;
      }
    });
  }

  ngOnInit(): void {
  }

  navigate(navigateTo: string){
    if(navigateTo === 'products'){
      this.isProductActive = true;
      this.isCartActive = false;
    }else if(navigateTo === 'cart') {
      this.isProductActive = false;
      this.isCartActive = true;
    }
    this.router.navigateByUrl(navigateTo);
  }
}

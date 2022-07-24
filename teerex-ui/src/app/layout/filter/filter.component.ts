import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
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

  showClearFilter = false;
  
  constructor(public dialogRef: MatDialogRef<FilterComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any,) {
      if(this.data) this.filterObj = JSON.parse(JSON.stringify(this.data));
    }

  ngOnInit(): void {
  }

  filterOrSearchItem(){
    this.dialogRef.close({filter: this.filterObj});
  }

  clearFilter(){
    this.dialogRef.close({clear: true});
  }

  closePopUp(){
    this.dialogRef.close(false);
  }
}

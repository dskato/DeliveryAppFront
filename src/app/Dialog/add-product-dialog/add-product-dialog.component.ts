import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { OverviewComponent } from 'src/app/overview/overview.component';
import { AddProductDialogData } from 'src/app/overview/overview.component';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css'],
})
export class AddProductDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddProductDialogData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

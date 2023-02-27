import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddProductDialogComponent } from '../Dialog/add-product-dialog/add-product-dialog.component';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface AddProductDialogData {
  name: string;
  weight: string;
  description: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
  description: string;
}
interface Product {
  id: number;
  name: string;
  weight: string;
  description: string;
  userId: number;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  public user!: User;

  //Product variables
  name: string = '';
  weight: string = '';
  description: string = '';

  //Product Grid
  dataSource!: MatTableDataSource<any>;
  public products!: Product[];
  displayedColumns: string[] = [
    'name',
    'weight',
    'description',
    'delete',
    'save',
  ];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.route.snapshot.queryParams['user']);
    console.log(this.user);
    this.getAllUserProducts(this.user.id);
  }

  getAllUserProducts(userId: number) {
    const url = `https://localhost:7201/get-productbyuserid?userId=${userId}`;
    this.http.get<{ data: Product[] }>(url).subscribe((response) => {
      this.products = response.data;
      console.log(this.products);
      this.dataSource = new MatTableDataSource(response.data);
    });
  }

  showAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '350px',
      data: {
        name: this.name,
        weight: this.weight,
        description: this.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog closed');
      this.name = result.name;
      this.weight = result.weight;
      this.description = result.description;
      console.log(
        'product data added -> ' +
          this.name +
          ' ' +
          this.weight +
          ' ' +
          this.description
      );

      if (this.name != '' && this.description != '' && this.weight != '') {
        this.createProduct(
          this.name,
          this.description,
          this.weight,
          this.user.id
        ).subscribe(
          (response) => {
            console.log(response);
            //Refresh
            this.getAllUserProducts(this.user.id);
            this.snackBar.open('Product created succesfully!', 'Close', {
              duration: 2000, 
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  editProduct(element: any) {
    console.log(element);
    const url = `https://localhost:7201/edit-product`;
    const requestBody = {
      Id: element.id,
      Name: element.name,
      Weight: element.weight,
      Description: element.description,
    };
    this.http.put(url, requestBody).subscribe(
      (response) => {
        console.log('Product updated successfully');
        this.snackBar.open('Product updated successfully!', 'Close', {
          duration: 2000, 
        });
        console.log(response);
      },
      (error) => console.error(error)
    );
  }

  deleteProduct(element: any) {
    console.log('Deleted product -> ' + element.name + ' ID: ' + element.id);
    const url = `https://localhost:7201/delete-productbyid?id=${element.id}`;
    this.http.delete(url).subscribe(
      (response) => {
        console.log(response);
        console.log('Product deleted successfully');
        this.getAllUserProducts(this.user.id);
        this.snackBar.open('Product deleted successfully!', 'Close', {
          duration: 2000, 
        });
      },
      (error) => console.error(error)
    );
  }

  createProduct(
    name: string,
    weight: string,
    description: string,
    userId: number
  ) {
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Weight', weight);
    formData.append('Description', description);
    formData.append('UserId', userId.toString());
    return this.http.post('https://localhost:7201/create-product', formData);
  }
}

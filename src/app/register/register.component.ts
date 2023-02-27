import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  email!: string;
  password!: string;
  firstname!: string;
  lastname!: string;
  usertype!: string;

  private createUserUrl = 'https://localhost:7201/create-user';

  constructor(private router: Router, private http: HttpClient,private snackBar: MatSnackBar) {}

  onSubmit() {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('firstName', this.firstname);
    formData.append('lastName', this.lastname);
    formData.append('description', '');
    formData.append('address', '');
    formData.append('role', this.usertype);

    console.log('DATA: ' + JSON.stringify(formData));

    this.http.post(this.createUserUrl, formData).subscribe(
      (response) => {
        console.log(response);
        this.snackBar.open('User created successfully!', 'Close', {
          duration: 2000, 
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        this.snackBar.open('Something went wrong!', 'Close', {
          duration: 2000, 
        });
      }
    );
  }

  ngOnInit(): void {}
}

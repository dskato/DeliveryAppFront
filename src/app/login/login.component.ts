import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address: string;
  description: string;
}

interface ValidateUserResponse {
  code: number;
  codeText: string;
  data: User;
  message: string | null;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  
  email!: string;
  password!: string;
  private apiUrl = 'https://localhost:7201/post-validateuser';


  constructor(private router: Router,private http: HttpClient,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  

  validateUser(){
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.http.post<ValidateUserResponse>(this.apiUrl, formData).subscribe(
      (response) => {
        // Handle successful response
        console.log(response);
        this.router.navigate(['/overview'], { queryParams: { user: JSON.stringify(response.data) } });
        
      },
      (error) => {
        // Handle error response
        console.error(error);
        this.snackBar.open('Incorrect email or password!', 'Close', {
          duration: 2000, 
        });
      }
    );
  }

  navigateUserRegister(): void{
    this.router.navigate(['/register']);
  }

}

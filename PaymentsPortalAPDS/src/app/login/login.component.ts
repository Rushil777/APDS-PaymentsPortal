import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  activeForm : 'login' | 'register' = 'register';

  registerObj:registerModel = new registerModel();
  loginObj:loginModel = new loginModel();
  constructor(private _snackbar:MatSnackBar, private _router: Router, private http: HttpClient){}

  toggleForm(form : 'login' | 'register')
  {
    this.activeForm = form;
  }

  registerForm()
  {
    this.http.post('https://localhost:3001/register', this.registerObj, {
      headers: { 'Content-Type': 'application/json' }
    })
      .subscribe(
        (_response: any) => {
          this._snackbar.open('User successfully registered', 'Close');
        },
        (error: any) => {
          console.error('Error during registration:', error);
          this._snackbar.open('Error registering user', 'Close');
        }
      );
  }
  loginForm(){
    this.http.post('https://localhost:3001/login', this.loginObj, {
      headers: { 'Content-Type': 'application/json' }
    })
      .subscribe(
        (response: any) => {
          if (response.success) {
            this._snackbar.open('Login Successful', 'Close');
            localStorage.setItem('loggedUser', JSON.stringify(response.token));
  
            // Check user role and redirect accordingly
            if (response.role === 'user') {
              this._router.navigateByUrl('/dashboard');
            } else if (response.role === 'employee') {
              this._router.navigateByUrl('/employee');
            }
          } else {
            this._snackbar.open('ID Number or Password is incorrect', 'Close');
          }
        },
        (error: any) => {
          console.error('Error during login', error);
          this._snackbar.open('Error logging in', 'Close');
        }
      );
  }
  
}
export class registerModel{
  name:string;
  surname:string;
  idNumber:string;
  accNumber:string;
  password:string;
  constructor(){
    this.name ="";
    this.surname ="";
    this.idNumber = "";
    this.accNumber = ""; 
    this.password = "";
  }
}
export class loginModel{
  idNumber:string;
  password:string;
  constructor(){
    this.idNumber = "";
    this.password = "";
  }
}

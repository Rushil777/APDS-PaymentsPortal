import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  activeForm : 'login' | 'register' = 'register';

  registerObj:registerModel = new registerModel();
  loginObj:loginModel = new loginModel();
  constructor(private _snackbar:MatSnackBar, private _router: Router){}

  toggleForm(form : 'login' | 'register')
  {
    this.activeForm = form;
  }

  registerForm()
  {
    const localusers = localStorage.getItem('users');
    if(localusers != null)
    {
      const users = JSON.parse(localusers);
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    }else{ 
      const users = [];
      users.push(this.registerObj);
      localStorage.setItem('users', JSON.stringify(users));
    }
    this._snackbar.open('User sucessfully registered', 'Close');
  }
  loginForm(){
    const localusers = localStorage.getItem('users');
    if(localusers != null)
    {
      const users = JSON.parse(localusers);
      users.push(this.registerObj);
      const isUserExist = users.find((user:registerModel)=> user.idNumber == this.loginObj.idNumber && user.password == this.loginObj.password)
      if(isUserExist != undefined)
      {
        this._snackbar.open('Login Successful', 'Close');
        localStorage.setItem('loggedUser', JSON.stringify(isUserExist));
        this._router.navigateByUrl('/dashboard');
      }else{
        this._snackbar.open('ID Number or Password is incorrect.');

      }
    }
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

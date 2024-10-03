// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private http: HttpClient) {}

  onSubmit(formData: any) {
    // Make an HTTP request to your server to log the user in
    this.http.post('/api/login', formData).subscribe(response => {
      console.log('Login successful', response);
    });
  }
}

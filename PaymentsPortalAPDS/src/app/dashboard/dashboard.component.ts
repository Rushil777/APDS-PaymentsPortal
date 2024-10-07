import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from 'express';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  completedPayment: paymentRequestModel=new paymentRequestModel()
  constructor(private _router: Router, private http:HttpClient,private _snackbar:MatSnackBar){
 }


 paymentsForm(){
  this.http.post('https://localhost:3001/paymentrequest', this.completedPayment,
    {headers:{'Content-Type': 'application/json'}
  })
  .subscribe(
    (response:any)=>{
      this._snackbar.open('Payment Request Submitted','Close');
    },
    (error:any)=>{
      console.error('Error During Submission:',error);
      this._snackbar.open('Error during submission','Close')
    }
  );
 }

  };

  export class paymentRequestModel{
    idNumber: string;
    recipientName: string;
    bankname : string;
    swiftcode: string;
    accountNumber: string;
    currency : string;
    number : string;
    recipientsReference : string;
    ownReference : string;

    constructor(){
      this.idNumber = "";
      this.recipientName = "";
      this.bankname="";
      this.swiftcode="";
      this.accountNumber="";
      this.currency="";
      this.number="";
      this.recipientsReference="";
      this.ownReference="";
    }

  }







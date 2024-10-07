import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../payment.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  outstandingPayments: any[] = [];
  completedPayment: paymentRequestModel=new paymentRequestModel()
  constructor(private http:HttpClient,private _snackbar:MatSnackBar, private paymentService: PaymentService){
 }

 ngOnInit(): void {
  this.loadOutstandingPayments();
}
 
loadOutstandingPayments() {
  this.paymentService.getOutstandingPayments().subscribe(
    (payments: any[]) => {
      this.outstandingPayments = payments;
    },
    (error) => {
      console.error('Error fetching payments:', error);
    }
  );
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
    bankName : string;
    swiftCode: string;
    accountNumber: string;
    currency : string;
    amount : string;
    recipientReference : string;
    ownReference : string;
    constructor(){
      this.idNumber = "";
      this.recipientName = "";
      this.bankName="";
      this.swiftCode="";
      this.accountNumber="";
      this.currency="";
      this.amount="";
      this.recipientReference="";
      this.ownReference="";
    }

  }







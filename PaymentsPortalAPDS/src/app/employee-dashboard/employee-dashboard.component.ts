import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';


@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  payments: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe((data: any[]) => {
      this.payments = data;
    });
  }

  verifyPayment(id: string) {
    this.paymentService.verifyPayment(id).subscribe(response => {
      alert('Payment Verified');
    });
  }

  declinePayment(id: string) {
    this.paymentService.declinePayment(id).subscribe(response => {
      alert('Payment Declined');
    });
  }
}
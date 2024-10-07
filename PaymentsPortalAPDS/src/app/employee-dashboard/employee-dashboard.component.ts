import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PaymentService } from '../payment.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  payments: any[] = [];

  constructor(
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  verifyPayment(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const confirmVerify = window.confirm('Are you sure you want to verify this payment?');
      if (confirmVerify) {
        this.paymentService.verifyPayment(id).subscribe(response => {
          alert('Payment Verified');
          this.loadPayments();
        });
      }
    }
  }

  declinePayment(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const confirmDecline = window.confirm('Are you sure you want to decline this payment?');
      if (confirmDecline) {
        this.paymentService.declinePayment(id).subscribe(response => {
          alert('Payment Declined');
          this.loadPayments();
        });
      }
    }
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe((data: any[]) => {
      this.payments = data;
    });
  }
}

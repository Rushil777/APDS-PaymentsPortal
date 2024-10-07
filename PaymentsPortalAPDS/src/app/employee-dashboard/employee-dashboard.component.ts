import { PaymentService } from '../payment.service';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit {
  payments: any[] = [];

  constructor(
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID to detect the platform
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  verifyPayment(id: string) {
    // Ensure the window.confirm only runs in browser environment
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
    // Ensure the window.confirm only runs in browser environment
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

  // Helper method to reload the list after actions
  loadPayments() {
    this.paymentService.getPayments().subscribe((data: any[]) => {
      this.payments = data;
    });
  }
}

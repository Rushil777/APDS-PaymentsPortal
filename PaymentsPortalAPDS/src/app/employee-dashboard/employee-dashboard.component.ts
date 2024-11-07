import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PaymentEntry } from '../shared/payment-entry.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Ensure HttpClientModule is imported here
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  paymentEntries: PaymentEntry[] = [];
  paymentSubscription = new Subscription();

  // Replace with your actual API endpoint
  private apiUrl = 'https://localhost:3001/payment-entries'; // Adjust the URL accordingly

  constructor(private http: HttpClient, private router: Router) {
    console.log('EmployeeDashboardComponent initialized');
  }

  ngOnInit(): void {
    this.getPaymentEntries();
  }

  getPaymentEntries(): void {
    this.http.get<{ paymentEntries: PaymentEntry[] }>(this.apiUrl).subscribe(
      (response) => {
        this.paymentEntries = response.paymentEntries; // Access the paymentEntries array
      },
      (error) => {
        if (error.status === 0) {
          console.error('Network error: Make sure the backend server is running and accessible.');
        } else {
          console.error(`Error fetching payment entries (Status: ${error.status}):`, error);
        }
      }
    );
  }
  
  

  onVerify(index: number): void {
    const entry = this.paymentEntries[index];
  
    // Check if the entry is already verified
    if (entry.status === 'VERIFIED') {
      alert('This entry is already verified.');
      return;
    }
  
    // Call the API to update the status using the MongoDB _id
    this.http.put<{ paymentEntry: PaymentEntry }>(`${this.apiUrl}/${entry._id}`, { status: 'VERIFIED' }).subscribe(
      (response) => {
        // Update the local entry status
        this.paymentEntries[index].status = response.paymentEntry.status;
        alert('Payment entry verified successfully.');
      },
      (error) => {
        console.error('Error verifying payment entry:', error);
        alert('Failed to verify payment entry. Please try again later.');
      }
    );
  }
  
}

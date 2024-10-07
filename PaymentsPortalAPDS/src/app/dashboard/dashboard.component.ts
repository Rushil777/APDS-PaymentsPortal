import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  payments = [];
  isPopupVisible = false;
  formData = {
    idNumber: '',
    recipientName: '',
    bankName: '',
    swiftCode: '',
    accountNumber: '',
    currency: '',
    amount: 0,
    ownReference: ''
  };

  showPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    this.closePopup();
  }

  // Fetching payments data here
}

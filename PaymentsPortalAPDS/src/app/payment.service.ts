import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:3001/paymentrequest';
  constructor(private http: HttpClient) {}

  getPayments() {
    return this.http.get<any[]>('/api/payments');
  }

  verifyPayment(id: string) {
    return this.http.post(`/api/payments/verify/${id}`, {});  // Verify payment by ID
  }

  declinePayment(id: string) {
    return this.http.post(`/api/payments/decline/${id}`, {});  // Decline payment by ID
  }
  getOutstandingPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

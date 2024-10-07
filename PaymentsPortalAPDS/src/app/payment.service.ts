import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:3001/api/payments';

  constructor(private http: HttpClient) {}

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  verifyPayment(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { id });
  }

  declinePayment(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/decline`, { id });
  }
}

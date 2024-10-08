import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentEntry } from '../shared/payment-entry.model';
import { PaymentDataService } from '../shared/payment-data.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit, OnDestroy {
  
  paymentEntries: PaymentEntry[];
  paymentSubscription = new Subscription();
  constructor(private paymentDataService: PaymentDataService, private router: Router){}

  ngOnDestroy(): void {
    this.paymentSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.paymentDataService.getPaymentEntries();
    this.paymentSubscription = this.paymentDataService.paymentSubject.subscribe(entries => {
      this.paymentEntries = entries
    })
  }

  onVerify(index: number){
    
  }
}

import { Injectable } from "@angular/core";
import { PaymentEntry } from "./payment-entry.model";
import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn:"root"})
export class PaymentDataService{

    constructor(private http: HttpClient){}

    paymentSubject = new Subject<PaymentEntry[]>();
    paymentEntries: PaymentEntry[] = []


    getPaymentEntries(){
        this.http.get<{paymentEntries: any}>('https://localhost:3001/payment-entries')
        .pipe(map((responseData) => {
            return responseData.paymentEntries.map((entry: {
                idNumber: string; 
                recepientName: string;
                bankName: string; 
                swiftCode: string; 
                accountNumber: string;
                currency: string; 
                amount: string; 
                recepientReference: string;
                ownReference: string;
                status: string; 
                _id: string
            }) => {
                return {
                    idNumber: entry.idNumber,
                    recepientName: entry.recepientName,
                    bankName: entry.bankName,
                    swiftCode: entry.swiftCode,
                    accountNumber: entry.accountNumber,
                    currency: entry.currency,
                    amount: entry.amount ,
                    recepientReference: entry.recepientReference,
                    ownReference: entry.ownReference,
                    status: entry.status,
                    _id: entry._id
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.paymentEntries = updateResponse;
            this.paymentSubject.next(this.paymentEntries);
        })
    }

    getPaymentEntry(index: number){
        return {...this.paymentEntries[index]};
    }

    onAddPaymentEntry(paymentEntry: PaymentEntry){
        this.http.post<{message: string}>('https://localhost:3001/outstanding-payment', paymentEntry).subscribe((jsonData) => {
            this.getPaymentEntries();
        })
    }
}
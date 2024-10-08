export class PaymentEntry{
    constructor(
        public idNumber: String, 
        public recepientName: String,
        public bankName: String, 
        public swiftCode: String, 
        public accountNumber: String,
        public currency: String, 
        public amount: String, 
        public recepientReference: String,
        public ownReference: String,
        public status: String){}
}
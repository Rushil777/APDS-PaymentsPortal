const express = require('express');
const mongoose = require('mongoose'); 
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');  // For hashing passwords
const cors = require('cors'); // To allow requests from Angular
const app = express();
const port = 3001; 
//hello

// Middleware:

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:4200',  
  methods: ['GET', 'POST'],         
  allowedHeaders: ['Content-Type'], 
  credentials: true                 
}));

 //Prevent clickjacking
app.use(helmet.frameguard({ action: 'DENY' }));

 //Prevent Cross-Site Scripting Attacks
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
}));

  //Prevent HTTP Strict Transport Security
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}));

 //Prevent against DDos Attacks
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Load SSL certificates
 const privateKey = fs.readFileSync('./Keys/privatekey.pem', 'utf8');
 const certificate = fs.readFileSync('./Keys/certificate.pem', 'utf8');
 const credentials = { key: privateKey, cert: certificate };


// MongoDB connection
mongoose.connect('mongodb+srv://mahathorushil59:eWGRCQWc6G9LqvGq@cluster0.zgl7b.mongodb.net/PaymentsPortal?retryWrites=true&w=majority',)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accNumber: { type: String, required: true, unique: true }, // Ensure this is unique
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'employee'], default: 'user' }
});
const User = mongoose.model('User', userSchema);

// Define the Employee model
const employeeSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee'], default: 'employee' }
});
const Employee = mongoose.model('Employee', employeeSchema);

//idNumber, recipient name, bank name of recipient, recipient swift code,  recipient account number, 
//currency, amount, recipient reference, own reference, status, date

const outstandingPaymentSchema = new mongoose.Schema({
    idNumber: { type: String, required: true},
    recipientName: { type: String, required: true}, 
    recipientBankName: { type: String, required: true}, 
    recipientSwiftCode: { type: String, required: true}, 
    recipientAccNumber: { type: String, required: true}, 
    currency: { type: String, required: true}, 
    amount: { type: String, required: true}, 
    recipientReference: { type: String, required: true}, 
    ownReference: { type: String, required: true},
    status: { type: String, required: true}, 
    date: {type: Date}
});
const OutstandingPayments = mongoose.model('OutstandingPayments', outstandingPaymentSchema); 


// Handle employee registration
app.post('/register-employee', async (req, res) => {
  const { idNumber, password } = req.body;
 
  try {
    const existingEmployee = await Employee.findOne({ idNumber });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this ID already exists.' });
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({ idNumber, password: hashedPassword });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle user registration
app.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);

  const { idNumber, name, surname, accNumber, password } = req.body;
//Input validation (whitelisting) using RegEx Patterns
 const idNumberPattern = /^\d{6,13}$/; 
 const namePattern = /^[a-zA-Z]{1,30}$/; 
 const surnamePattern = /^[a-zA-Z]{1,30}$/; 
 const accNumberPattern = /^\d{8,16}$/;
 const passwordPattern = /^[a-zA-Z0-9@#*!&]{8,20}$/;
 //Validate the input against the whitelisted patterns
 if (!idNumberPattern.test(idNumber)) {
   return res.status(400).json({ error: 'Invalid ID number. Must be 6-13 digits.' });
 }
 if (!namePattern.test(name)) {
   return res.status(400).json({ error: 'Invalid name. Must be 1-30 alphabetic characters.' });
 }
 if (!surnamePattern.test(surname)) {
   return res.status(400).json({ error: 'Invalid surname. Must be 1-30 alphabetic characters.' });
 }
 if (!accNumberPattern.test(accNumber)) {
   return res.status(400).json({ error: 'Invalid account number. Must be 8-16 digits.' });
 }
 if (!passwordPattern.test(password)) {
   return res.status(400).json({ error: 'Invalid password. Must be 8-20 characters with special symbols allowed.' });
 }

  try {

    // Check if user already exists
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      console.log(`User with ID ${idNumber} already exists.`);
      return res.status(400).json({ error: 'Account already exists.' });
    }

    // Hash the password with bcrypt
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({ name, surname, idNumber, accNumber, password: hashedPassword});
    await newUser.save();

    console.log('User registered successfully:', newUser);
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during user registration:', error.message || error);
    return res.status(500).json({ error: 'Internal server error.' });
}
});

// Handle user login
app.post('/login', async (req, res) => {
  const { idNumber, password } = req.body; // Ensure these match the incoming request

  if (!idNumber || !password) {
    return res.status(400).json({ error: 'ID Number and Password are required' });
  }

  try {
    // Assuming you have separate collections for users and employees
    const user = await User.findOne({ idNumber });
    const employee = await Employee.findOne({ idNumber }); // Check if it's an employee

    if (!user && !employee) {
      return res.status(400).json({ error: 'User not found' });
    }

    // If it's a user
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        token: 'ThisIsTheSecretKeyWeWillUseToGenerateTokenForOurLogin.TheLongerTheStringTheMoreSecure',
        role: 'user'
      });
    }

    // If it's an employee
    if (employee) {
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        token: 'ThisIsTheSecretKeyWeWillUseToGenerateTokenForOurLogin.TheLongerTheStringTheMoreSecure', 
        role: 'employee'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Add a new outstanding payment to the database
app.post('/outstanding-payments', async (req, res) => {
  try {
      const {
          idNumber,
          recipientName,
          recipientBankName,
          recipientSwiftCode,
          recipientAccNumber,
          currency,
          amount,
          recipientReference,
          ownReference,
          status,
          date
      } = req.body;

      // Create a new outstanding payment document
      const newPayment = new OutstandingPayments({
          idNumber,
          recipientName,
          recipientBankName,
          recipientSwiftCode,
          recipientAccNumber,
          currency,
          amount,
          recipientReference,
          ownReference,
          status,
          date
      });

      // Save the payment to the database
      await newPayment.save();
      res.status(201).json({ message: 'Payment submitted successfully!' });
  } catch (error) {
      console.error('Error submitting payment:', error);
      res.status(500).json({ error: 'Failed to submit payment' });
  }
});



// Start the server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`Server started on https://localhost:${port}`);
});



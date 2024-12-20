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
const bodyparser = require('body-parser')

// Middleware:
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: 'http://localhost:4200',  
//   methods: ['GET', 'POST'],         
//   allowedHeaders: ['Content-Type'], 
//   credentials: true                 
// }));

app.use(cors());

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

const outstandingPaymentSchema = new mongoose.Schema({
    idNumber: { type: String, required: true},
    recipientName: { type: String, required: true}, 
    bankName: { type: String, required: true}, 
    swiftCode: { type: String, required: true}, 
    accountNumber: { type: String, required: true}, 
    currency: { type: String, required: true}, 
    amount: { type: String, required: true}, 
    recipientReference: { type: String, required: true}, 
    ownReference: { type: String, required: true},
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'DECLINED'], default: 'PENDING'}, 
    date: {type: Date}
});
const OutstandingPayments = mongoose.model('OutstandingPayments', outstandingPaymentSchema); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})


app.get('/payment-entries', async (req, res) => {
  try {
    const paymentEntries = await OutstandingPayments.find();
    res.json({ paymentEntries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

app.put('/payment-entries/:id', (req, res) => {
  const { id } = req.params; // MongoDB _id
  const { status } = req.body;

  OutstandingPayments.findByIdAndUpdate(id, { status }, { new: true })
    .then((updatedEntry) => {
      if (!updatedEntry) {
        return res.status(404).send('Payment entry not found');
      }
      res.json({ paymentEntry: updatedEntry });
    })
    .catch((error) => {
      console.error('Error updating payment entry:', error);
      res.status(500).send('Internal Server Error');
    });
});



// Handle employee registration
app.post('/register-employee', async (req, res) => {
  outstandingPaymentSchema
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
app.post('/outstanding-payment', async (req, res) => {
  console.log(`Received Payment Submission:`, req.body);
  const { idNumber, recipientName, bankName, swiftCode, accountNumber, currency, amount, recipientReference, ownReference } = req.body;

  if (!idNumber || !recipientName || !bankName || !swiftCode || !accountNumber || !currency || !amount || !recipientReference || !ownReference) {
      return res.status(400).json({ error: `All Fields are required` });
  }
  try {
      const paymentEntry = new OutstandingPayments({idNumber: req.body.idNumber, recipientName: req.body.recipientName, bankName: req.body.bankName, 
        swiftCode: req.body.swiftCode, accountNumber: req.body.accountNumber, currency: req.body.currency, amount: req.body.amount, 
        recipientReference: req.body.recipientReference, ownReference: req.body.ownReference, status: "PENDING"})
      paymentEntry.save();
      console.log(paymentEntry);  
      console.log(`Payment Successfully Made:`, paymentEntry);
      return res.status(201).json({ message: `Payment Successfully Made!` });
  } catch (error) {
      console.error(`Error during submission: `, error.message || error);
      return res.status(500).json({ error: `Internal Server Error ` });
  }
});

//Getting data from database
app.get('/payments', async (req, res) => {
  try {
    const outstandingPayment = await OutstandingPayments.find(); // Now using async/await
    res.json(outstandingPayment); // Send the data as JSON
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Start the server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`Server started on https://localhost:${port}`);
});



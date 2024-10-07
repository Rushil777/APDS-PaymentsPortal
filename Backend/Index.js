const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 4200;

const User = require('./Auth/User.js') ;

console.log('Hello')
mongoose.connect('mongodb+srv://mahathorushil59:eWGRCQWc6G9LqvGq@cluster0.zgl7b.mongodb.net/PaymentsPortal?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('Frontend'));

<<<<<<< HEAD
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
    status: { type: String, enum: ['PENDING', 'VERIFIED'], default: 'PENDING'}, 
    date: {type: Date}
});
const OutstandingPayments = mongoose.model('OutstandingPayments', outstandingPaymentSchema); 

const completedPayments = new mongoose.Schema({
    recipientName: { type: String, required: true},
    recipientBankName: { type: String, required: true}, 
    currency: { type: String, required: true}, 
    amount: { type: String, required: true}, 
    ownReference: { type: String, required: true}, 
    status: { type: String, enum: ['PENDING', 'VERIFIED']}
});
const CompletedPayments = mongoose.model('CompletedPayments', completedPayments) ; 


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
=======
// Route to serve the homepage (login.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
>>>>>>> origin/main
});

// Handle user registration
app.post('/Register', async (req, res) => {
  const { firstName, idNumber, accountNumber, password } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ accountNumber });
      if (existingUser) {
          return res.status(400).send('Account already exists.');
      }

      // Create and save the new user
      const user = new User({ firstName, idNumber, accountNumber, password });
      await user.save();
      res.status(201).send('User registered successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred during registration.');
  }
});bac

// Route to get all completed payments
app.get('/completed-payments', async (req, res) => {
  try {
      const payments = await CompletedPayments.find({});
      res.json(payments);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching completed payments.');
  }
});
// Route to add a new outstanding payment
app.post('/add-payment', async (req, res) => {
  const { idNumber, recipientName, bankName, swiftCode, accountNumber, currency, amount, recipientReference, ownReference } = req.body;

  try {
      const newPayment = new OutstandingPayments({
          idNumber,
          recipientName,
          bankName,
          swiftCode,
          accountNumber,
          currency,
          amount,
          recipientReference,
          ownReference
      });

      await newPayment.save();
      res.status(201).send('Payment added successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while adding the payment.');
  }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
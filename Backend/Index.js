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

// Route to serve the homepage (login.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
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
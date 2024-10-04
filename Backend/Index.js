const express = require('express');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');  // For hashing passwords
const cors = require('cors'); // To allow requests from Angular
const app = express();
const port = 3001; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes

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
});

const User = mongoose.model('User', userSchema);

// Handle user registration
app.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);

  const { idNumber, name, surname, accNumber, password } = req.body;

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
  const { idNumber, password } = req.body;

  try {
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(400).json({ error: 'Invalid ID Number or Password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid ID Number or Password.' });
    }

    // Successful login
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

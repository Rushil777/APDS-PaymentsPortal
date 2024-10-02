const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

console.log('Hello')
mongoose.connect('mongodb+srv://mahathorushil59:eWGRCQWc6G9LqvGq@cluster0.zgl7b.mongodb.net/PaymentsPortal?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
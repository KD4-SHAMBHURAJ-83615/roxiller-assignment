const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = 5000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/roxiller')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
      console.log('Initializing database...');
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const data = response.data;
  
      await Transaction.deleteMany(); // Clear existing data
      await Transaction.insertMany(data); // Seed data
  
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error.message);
    }
  });
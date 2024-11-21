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


app.get('/api/transactions', async (req, res) => {
  const { search = '', page = 1, perPage = 10, month } = req.query;
  
  const monthIndex = new Date(`${month} 1, 2023`).getMonth(); // Convert month name to index
  const startDate = new Date(2020, monthIndex, 1);
  const endDate = new Date(2023, monthIndex + 1, 0);

  const query = {
    dateOfSale: { $gte: startDate, $lte: endDate },
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: search ? Number(search) : { $exists: true } },
    ],
  };

  const skip = (page - 1) * perPage;

  const transactions = await Transaction.find(query).skip(skip).limit(Number(perPage));
  const total = await Transaction.countDocuments(query);

  res.json({ transactions, total });
});

app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(`${month} 1, 2023`).getMonth();
  const startDate = new Date(2020, monthIndex, 1);
  const endDate = new Date(2023, monthIndex + 1, 0);

  const totalSaleAmount = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: '$price' } } },
  ]);

  const soldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: true });
  const unsoldItemsCount = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

  res.json({
    totalSaleAmount: totalSaleAmount[0]?.total || 0,
    soldItemsCount,
    unsoldItemsCount,
  });
});




app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(`${month} 1, 2023`).getMonth();
  const startDate = new Date(2020, monthIndex, 1);
  const endDate = new Date(2023, monthIndex + 1, 0);

  const priceRanges = [
    [0, 100], [101, 200], [201, 300], [301, 400], [401, 500],
    [501, 600], [601, 700], [701, 800], [801, 900], [901, Infinity],
  ];

  const barData = await Promise.all(priceRanges.map(async ([min, max]) => {
    const count = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      price: { $gte: min, $lt: max },
    });
    return { range: `${min}-${max === Infinity ? 'Above' : max}`, count };
  }));

  res.json(barData);
});



app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(`${month} 1, 2023`).getMonth();
  const startDate = new Date(2020, monthIndex, 1);
  const endDate = new Date(2023, monthIndex + 1, 0);

  const categoryData = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  res.json(categoryData);
});



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
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GiftLink API is running'
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GiftLink API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 /api/gifts - Get all gifts`);
  console.log(`📡 /api/gifts/:id - Get gift by ID`);
  console.log(`📡 /api/search - Search gifts with filters`);
  console.log(`📡 /api/auth/register - Register new user`);
  console.log(`📡 /api/auth/login - Login user`);
});

module.exports = app;

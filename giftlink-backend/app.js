require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./models/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');  // ✅ Task 1: Imported

// Use routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);  // ✅ Task 2: Used

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GiftLink API is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`📡 /api/gifts - Get all gifts`);
      console.log(`📡 /api/gifts/:id - Get gift by ID`);
      console.log(`📡 /api/search - Search gifts with filters`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
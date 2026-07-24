// ============================================
// Task 1: Import the Natural library
// ============================================
const natural = require('natural');

// ============================================
// Task 2: Initialize the Express server
// ============================================
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// Task 3: Create a POST /sentiment endpoint
// ============================================
app.post('/sentiment', (req, res) => {
  try {
    // ============================================
    // Task 4: Extract the sentence parameter from the request body
    // ============================================
    const { sentence } = req.body;

    // Validate input
    if (!sentence) {
      return res.status(400).json({ 
        error: 'Missing sentence parameter',
        message: 'Please provide a sentence in the request body'
      });
    }

    if (sentence.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Empty sentence',
        message: 'Sentence cannot be empty'
      });
    }

    // Create sentiment analyzer
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    
    // Get sentiment score
    const score = analyzer.getSentiment(sentence.split(' '));

    // ============================================
    // Task 5: Process the response by adding sentiment
    // If score is < 0, sentiment should be negative
    // If score is between 0 and 0.33, it should be neutral
    // Otherwise, sentiment should be positive
    // ============================================
    let sentiment = 'neutral';
    
    if (score < 0) {
      sentiment = 'negative';
    } else if (score > 0.33) {
      sentiment = 'positive';
    } else {
      sentiment = 'neutral';
    }

    // ============================================
    // Task 6: Implement success return state
    // ============================================
    res.status(200).json({ 
      sentimentScore: score, 
      sentiment: sentiment 
    });

  } catch (error) {
    // ============================================
    // Task 7: Implement error return state
    // ============================================
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Sentiment Analysis Service'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Sentiment Analysis Service',
    endpoints: {
      '/sentiment': 'POST - Analyze sentiment',
      '/health': 'GET - Health check'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Sentiment Analysis Service running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 POST /sentiment - Analyze sentiment`);
  console.log(`📡 GET /health - Health check`);
});

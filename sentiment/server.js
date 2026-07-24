const express = require('express');
const cors = require('cors');
const natural = require('natural');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// POST /sentiment - Analyze sentiment
app.post('/sentiment', (req, res) => {
  try {
    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: 'Missing sentence parameter' });
    }

    if (sentence.trim().length === 0) {
      return res.status(400).json({ error: 'Empty sentence' });
    }

    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const score = analyzer.getSentiment(sentence.split(' '));

    let sentiment = 'neutral';
    if (score > 0.2) sentiment = 'positive';
    else if (score < -0.2) sentiment = 'negative';

    res.json({
      sentence: sentence,
      score: score,
      sentiment: sentiment,
      positive: score > 0.2,
      negative: score < -0.2,
      neutral: score >= -0.2 && score <= 0.2
    });

  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Sentiment Analysis Service' });
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sentiment Analysis Service running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 POST /sentiment - Analyze sentiment`);
  console.log(`📡 GET /health - Health check`);
});

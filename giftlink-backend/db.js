const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftlink';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    db = client.db('giftlink');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

async function closeConnection() {
  try {
    await client.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection,
  client,
};

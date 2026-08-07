const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftlink';

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

/**
 * Connect to MongoDB
 * @returns {Promise<Db>} MongoDB database instance
 */
async function connectToDatabase() {
  try {
    // This is the required line: await client.connect()
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    db = client.db('giftlink');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

/**
 * Get the database instance
 * @returns {Db} MongoDB database instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Close the MongoDB connection
 * @returns {Promise<void>}
 */
async function closeConnection() {
  try {
    await client.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
}

// Export the functions
module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection,
  client,
};

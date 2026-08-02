const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbInstance;

module.exports = {
  connectToDatabase: async function() {
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }
      
      console.log('Connecting to MongoDB...');
      
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        authSource: 'admin'
      });
      
      await client.connect();
      console.log('✅ Connected to MongoDB successfully');
      
      const dbName = process.env.DB_NAME || 'giftlink';
      dbInstance = client.db(dbName);
      console.log(`✅ Using database: ${dbName}`);
      
      return dbInstance;
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error.message);
      throw error;
    }
  },
  
  getDb: function() {
    if (!dbInstance) {
      throw new Error('Database not connected. Call connectToDatabase first.');
    }
    return dbInstance;
  }
};
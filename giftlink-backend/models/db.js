const { MongoClient } = require('mongodb');

const dbName = 'giftdb';
let dbInstance;

module.exports = {
  connectToDatabase: async function() {
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }
      
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      await client.connect();
      console.log('✅ Connected to MongoDB successfully');
      
      dbInstance = client.db(dbName);
      
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

const { connectToDatabase, getDb } = require('./models/db');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    await connectToDatabase();
    const db = getDb();
    console.log('✅ Database connected successfully!');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Check if gifts collection exists
    const collection = db.collection('gifts');
    const count = await collection.countDocuments();
    console.log(`📊 Number of gifts: ${count}`);
    
    // If there are gifts, show a sample
    if (count > 0) {
      const sample = await collection.findOne();
      console.log('📝 Sample gift:', sample);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();

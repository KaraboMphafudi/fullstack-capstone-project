const { connectToDatabase, getDb } = require('./models/db');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    await connectToDatabase();
    const db = getDb();
    const collection = db.collection('gifts');
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing gifts');
    
    // Insert test data
    const gifts = [
      {
        id: "1",
        name: "Sony Headphones",
        description: "Wireless noise-cancelling headphones, perfect for music",
        category: "Electronics",
        condition: "Like New",
        age_years: 1,
        image: "https://via.placeholder.com/200"
      },
      {
        id: "2",
        name: "Wooden Desk",
        description: "Solid oak desk, excellent condition",
        category: "Furniture",
        condition: "Good",
        age_years: 3,
        image: "https://via.placeholder.com/200"
      },
      {
        id: "3",
        name: "Harry Potter Books",
        description: "Complete set of Harry Potter books",
        category: "Books",
        condition: "Good",
        age_years: 5,
        image: "https://via.placeholder.com/200"
      },
      {
        id: "4",
        name: "Mountain Bike",
        description: "26-inch mountain bike, great for trails",
        category: "Sports",
        condition: "Fair",
        age_years: 4,
        image: "https://via.placeholder.com/200"
      },
      {
        id: "5",
        name: "Coffee Maker",
        description: "Automatic drip coffee maker with timer",
        category: "Kitchen",
        condition: "Good",
        age_years: 2,
        image: "https://via.placeholder.com/200"
      }
    ];
    
    const result = await collection.insertMany(gifts);
    console.log(`✅ Inserted ${result.insertedCount} gifts`);
    
    // Verify
    const count = await collection.countDocuments();
    console.log(`📊 Total gifts in database: ${count}`);
    
    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedDatabase();

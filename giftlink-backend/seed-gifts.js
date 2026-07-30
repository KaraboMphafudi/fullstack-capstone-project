// One-off script to populate the `gifts` collection with sample data.
// Run with: node seed-gifts.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const gifts = [
    {
        id: '1',
        name: 'Lamp',
        category: 'Living Room',
        condition: 'New',
        posted_by: '26872',
        zipcode: '94805',
        date_added: Math.floor(new Date('2024-01-05').getTime() / 1000),
        age_days: 400,
        age_years: 1.1,
        description: 'A charming lamp that adds a warm glow to any room. Barely used, still in great shape.',
        image: ''
    },
    {
        id: '2',
        name: 'Curtain',
        category: 'Living Room',
        condition: 'Used',
        posted_by: '26872',
        zipcode: '94805',
        date_added: Math.floor(new Date('2024-01-10').getTime() / 1000),
        age_days: 250,
        age_years: 0.7,
        description: 'A set of thick blackout curtains, great for blocking out light in a bedroom or living room.',
        image: ''
    },
    {
        id: '3',
        name: 'Side Table',
        category: 'Furniture',
        condition: 'Older',
        posted_by: '26872',
        zipcode: '94805',
        date_added: Math.floor(new Date('2023-11-20').getTime() / 1000),
        age_days: 900,
        age_years: 2.5,
        description: 'A sturdy wooden side table, a few scuffs but very functional. Perfect for a small apartment.',
        image: ''
    },
    {
        id: '4',
        name: 'Sofa',
        category: 'Furniture',
        condition: 'Used',
        posted_by: '26872',
        zipcode: '94805',
        date_added: Math.floor(new Date('2024-02-01').getTime() / 1000),
        age_days: 180,
        age_years: 0.5,
        description: 'Comfortable two-seater sofa in grey fabric. Some minor wear but very cozy.',
        image: ''
    },
    {
        id: '5',
        name: 'Coffee Table',
        category: 'Furniture',
        condition: 'New',
        posted_by: '26872',
        zipcode: '94805',
        date_added: Math.floor(new Date('2024-03-01').getTime() / 1000),
        age_days: 30,
        age_years: 0.1,
        description: 'A sleek glass-top coffee table, barely used and in excellent condition.',
        image: ''
    }
];

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not set in .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('giftdb');
        const collection = db.collection('gifts');

        const existingCount = await collection.countDocuments();
        console.log(`Existing documents in 'gifts' collection: ${existingCount}`);

        const result = await collection.insertMany(gifts);
        console.log(`Inserted ${result.insertedCount} gift documents.`);
    } catch (error) {
        console.error('Error seeding gifts:', error);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

seed();

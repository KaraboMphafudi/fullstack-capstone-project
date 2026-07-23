const express = require('express');
const router = express.Router();
const { getDb } = require('../models/db');

// GET /api/search - Search gifts with filters
router.get('/', async function(req, res) {
  try {
    const db = getDb();
    const collection = db.collection('gifts');
    
    const query = {};
    
    // Filter by name (partial match, case-insensitive)
    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by condition
    if (req.query.condition) {
      query.condition = req.query.condition;
    }
    
    // Filter by age_years (less than or equal to)
    if (req.query.age_years) {
      query.age_years = { $lte: parseFloat(req.query.age_years) };
    }
    
    const gifts = await collection.find(query).toArray();
    
    res.json({
      success: true,
      count: gifts.length,
      data: gifts
    });
  } catch (error) {
    console.error('Error searching gifts:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching gifts',
      error: error.message
    });
  }
});

module.exports = router;
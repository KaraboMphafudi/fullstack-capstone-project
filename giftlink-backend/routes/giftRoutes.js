const express = require('express');
const router = express.Router();
const { getDb } = require('../models/db');

// GET /api/gifts - Get all gifts
router.get('/', async function(req, res) {
  try {
    const db = getDb();
    const collection = db.collection('gifts');
    const gifts = await collection.find({}).toArray();
    res.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gifts',
      error: error.message
    });
  }
});

// GET /api/gifts/:id - Get gift by ID
router.get('/:id', async function(req, res) {
  try {
    const db = getDb();
    const collection = db.collection('gifts');
    const id = req.params.id;
    const gift = await collection.findOne({ id: id });
    
    if (!gift) {
      return res.status(404).json({
        success: false,
        message: 'Gift not found'
      });
    }
    
    res.json(gift);
  } catch (error) {
    console.error('Error fetching gift:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gift',
      error: error.message
    });
  }
});

module.exports = router;

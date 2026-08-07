const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase, getDatabase } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: result.insertedId,
        firstName,
        lastName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register user', 
      error: error.message 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('users');

    const user = await collection.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to login', 
      error: error.message 
    });
  }
});

module.exports = router;

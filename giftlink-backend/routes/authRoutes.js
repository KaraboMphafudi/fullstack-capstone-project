// routes/authRoutes.js

// ============================================
// Step 1 - Task 2: Import necessary packages
// ============================================
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const pino = require('pino');
const { connectToDatabase } = require('../models/db');

const router = express.Router();

// ============================================
// Step 1 - Task 3: Create a Pino logger instance
// ============================================
const logger = pino();

dotenv.config();

// ============================================
// Step 1 - Task 4: Create JWT secret
// ============================================
const JWT_SECRET = process.env.JWT_SECRET;

// ============================================
// Step 2: Implement the /register endpoint
// ============================================
router.post('/register', 
    // Validation middleware
    [
        body('firstName')
            .trim()
            .notEmpty().withMessage('First name is required')
            .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
        
        body('lastName')
            .trim()
            .notEmpty().withMessage('Last name is required')
            .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
        
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email address')
            .normalizeEmail(),
        
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error('Validation errors:', errors.array());
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            // ============================================
            // Task 1: Connect to MongoDB through connectToDatabase
            // ============================================
            const db = await connectToDatabase();

            // ============================================
            // Task 2: Access MongoDB collection
            // ============================================
            const collection = db.collection('users');

            const { firstName, lastName, email, password } = req.body;

            // ============================================
            // Task 3: Check for existing email
            // ============================================
            const existingEmail = await collection.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                logger.warn(`Registration attempt with existing email: ${email}`);
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Hash the password
            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(password, salt);

            // ============================================
            // Task 4: Save user details in the database
            // ============================================
            const newUser = await collection.insertOne({
                email: email.toLowerCase(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                password: hash,
                createdAt: new Date(),
            });

            // ============================================
            // Task 5: Create JWT authentication with user._id as payload
            // ============================================
            const payload = {
                user: {
                    id: newUser.insertedId,
                },
            };

            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info(`User registered successfully: ${email}`);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                authtoken: authtoken,
                email: email.toLowerCase(),
                user: {
                    id: newUser.insertedId,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.toLowerCase()
                }
            });

        } catch (error) {
            logger.error('Registration error:', error);
            
            // Handle duplicate key error (MongoDB)
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
);

module.exports = router;
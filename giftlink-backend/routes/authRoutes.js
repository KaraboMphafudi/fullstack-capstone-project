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

// ============================================
// ✅ UPDATE USER PROFILE - PUT /api/auth/update
// ============================================
router.put('/update', 
    [
        body('firstName')
            .optional()
            .trim()
            .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
        
        body('lastName')
            .optional()
            .trim()
            .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
        
        body('email')
            .optional()
            .trim()
            .isEmail().withMessage('Please provide a valid email address')
            .normalizeEmail(),
        
        body('password')
            .optional()
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            // Task 2: Validate the input using validationResult
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error('Validation errors in update request', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            // Task 3: Check if email is present in the header
            const email = req.headers.email;
            if (!email) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ error: "Email not found in the request headers" });
            }

            // Task 4: Connect to MongoDB
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Task 5: Find user credentials in database
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                logger.error(`User not found with email: ${email}`);
                return res.status(404).json({ error: "User not found" });
            }

            // Update fields if provided
            const { firstName, lastName, password, email: newEmail } = req.body;

            if (newEmail) {
                const emailExists = await collection.findOne({ 
                    email: newEmail,
                    _id: { $ne: existingUser._id }
                });
                if (emailExists) {
                    return res.status(409).json({ error: "Email is already taken by another user" });
                }
                existingUser.email = newEmail;
            }

            if (firstName) existingUser.firstName = firstName.trim();
            if (lastName) existingUser.lastName = lastName.trim();
            if (password) {
                const salt = await bcryptjs.genSalt(10);
                existingUser.password = await bcryptjs.hash(password, salt);
            }

            existingUser.updatedAt = new Date();

            // Task 6: Update user credentials in database
            const updatedUser = await collection.findOneAndUpdate(
                { email: email },
                { $set: existingUser },
                { returnDocument: 'after' }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = updatedUser;

            // Task 7: Create JWT authentication
            const payload = {
                user: {
                    id: updatedUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info(`User updated successfully: ${email}`);

            res.json({
                success: true,
                message: 'User updated successfully',
                authtoken: authtoken,
                user: userWithoutPassword
            });

        } catch (error) {
            logger.error('Update error:', error);
            return res.status(500).json({ 
                error: 'Internal server error',
                details: error.message 
            });
        }
    }
);

module.exports = router;
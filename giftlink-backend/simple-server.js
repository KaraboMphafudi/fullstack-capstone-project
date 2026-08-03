const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Sample data
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
  },
  {
    id: "6",
    name: "Garden Tools Set",
    description: "Complete set of garden tools, barely used",
    category: "Garden",
    condition: "Like New",
    age_years: 1,
    image: "https://via.placeholder.com/200"
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple server running', 
    gifts: gifts.length 
  });
});

// Search endpoint
app.get('/api/search', (req, res) => {
  try {
    const { name, category, condition, age_years } = req.query;
    let results = [...gifts];
    
    if (name && name.trim() !== '') {
      results = results.filter(g => 
        g.name.toLowerCase().includes(name.toLowerCase()) ||
        g.description.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (category && category !== 'All Categories' && category !== '') {
      results = results.filter(g => g.category === category);
    }
    if (condition && condition !== 'Any Condition' && condition !== '') {
      results = results.filter(g => g.condition === condition);
    }
    if (age_years) {
      results = results.filter(g => g.age_years <= parseInt(age_years));
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all gifts
app.get('/api/gifts', (req, res) => {
  res.json(gifts);
});

// Get single gift by ID
app.get('/api/gifts/:id', (req, res) => {
  const gift = gifts.find(g => g.id === req.params.id);
  if (gift) {
    res.json(gift);
  } else {
    res.status(404).json({ message: 'Gift not found' });
  }
});

// ============================================
// ✅ REGISTRATION ENDPOINT
// ============================================
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Registration request received:', req.body);
  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: firstName, lastName, email, password'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: 'mock-jwt-token-12345',
    user: {
      id: 'mock-user-id-123',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim()
    }
  });
});

// ============================================
// ✅ LOGIN ENDPOINT
// ============================================
app.post('/api/auth/login', (req, res) => {
  console.log('📝 Login request received:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  res.json({
    authtoken: 'mock-jwt-token-12345',
    userName: 'John',
    userEmail: email
  });
});

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Start server on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 /api/health - Health check`);
  console.log(`📡 /api/search - Search gifts`);
  console.log(`📡 /api/gifts - Get all gifts`);
  console.log(`📡 /api/auth/register - Register user`);
  console.log(`📡 /api/auth/login - Login user`);
  console.log(`📦 ${gifts.length} sample gifts loaded`);
  console.log(`✅ CORS enabled for all origins`);
});
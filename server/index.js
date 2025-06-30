require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const homestayRoutes = require('./routes/homestays');
const bookingRoutes = require('./routes/bookings');
const listingRoutes = require('./routes/listings');
const ownerRoutes = require('./routes/owner');
const authRoutes = require('./routes/authRouter');
const adminRoutes = require('./routes/adminRouter');

const app = express();

// Basic middlewares
app.use(express.json());
app.use(cookieParser());

// Fixed CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://staypahad.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/homestays', homestayRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/owner-auth', ownerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/master', adminRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
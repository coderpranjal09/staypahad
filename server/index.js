const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const homestayRoutes = require('./routes/homestays');
const cors = require('cors');
const booking = require('./routes/bookings');
const addHomestay = require('./routes/listings');
const ownerlogin = require('./routes/owner');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
dotenv.config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://staypahad.netlify.app/', // Your Netlify frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser()); 
// Routes
app.get('/', (req, res) => {
  res.json({ message: "Backend is working!" });
});
app.use('/api/homestays', homestayRoutes);
app.use('/api/booking',booking);
app.use('/api/listing',addHomestay);
app.use('/api/owner-auth',ownerlogin);
app.use('/api/auth', authRouter);
app.use('/api/master',adminRouter);



// MongoDB connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch((err) => console.error(' MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

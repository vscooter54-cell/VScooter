const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Middleware imports
const { errorHandler, notFound } = require('./middleware/error');
const { sanitizeInput } = require('./middleware/validation');

// Route imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const supportRoutes = require('./routes/supportRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// CORS Configuration - Manual headers (cors package not working)
console.log('🔧 CORS: Setting manual headers for all origins');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Security Middleware
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - DISABLED FOR DEVELOPMENT
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later',
//   standardHeaders: true,
//   legacyHeaders: false
// });

// Apply rate limiting to all routes - DISABLED
// app.use('/api/', limiter);

// Stricter rate limit for auth routes - DISABLED
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: 'Too many authentication attempts, please try again later'
// });

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser Middleware
app.use(cookieParser());

// Data Sanitization against NoSQL Injection
// NOTE: express-mongo-sanitize is currently disabled due to Express v5 incompatibility
// Using custom sanitization middleware instead
// app.use(mongoSanitize({
//   replaceWith: '_'
// }));

// Custom sanitization middleware (provides NoSQL injection protection)
app.use(sanitizeInput);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes); // authLimiter removed for development
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VScooter API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      reviews: '/api/reviews',
      coupons: '/api/coupons',
      wishlist: '/api/wishlist',
      support: '/api/support',
      admin: '/api/admin'
    }
  });
});

// Error Handling Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛴  VScooter API Server                                 ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Port: ${PORT}                                             ║
║   Database: Connected                                     ║
║                                                           ║
║   API Endpoints:                                          ║
║   - Health: http://localhost:${PORT}/health                 ║
║   - Users: http://localhost:${PORT}/api/users               ║
║   - Products: http://localhost:${PORT}/api/products         ║
║   - Cart: http://localhost:${PORT}/api/cart                 ║
║   - Orders: http://localhost:${PORT}/api/orders             ║
║   - Reviews: http://localhost:${PORT}/api/reviews           ║
║   - Coupons: http://localhost:${PORT}/api/coupons           ║
║   - Wishlist: http://localhost:${PORT}/api/wishlist         ║
║   - Support: http://localhost:${PORT}/api/support           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;

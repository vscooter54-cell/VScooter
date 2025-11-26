const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  validateCart,
  mergeCart
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Validation rules
const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const applyCouponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required')
];

// Routes
router.get('/validate', validateCart);
router.get('/', getCart);
router.post('/items', addToCartValidation, validate, addToCart);
router.put('/items/:productId', validateObjectId('productId'), updateCartValidation, validate, updateCartItem);
router.delete('/items/:productId', validateObjectId('productId'), removeFromCart);
router.delete('/', clearCart);
router.post('/coupon', applyCouponValidation, validate, applyCoupon);
router.delete('/coupon', removeCoupon);
router.post('/merge', mergeCart);

module.exports = router;

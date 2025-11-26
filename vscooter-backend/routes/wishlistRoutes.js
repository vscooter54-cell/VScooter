const express = require('express');
const {
  getWishlist,
  addToWishlist,
  updateWishlistItem,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  moveAllToCart,
  shareWishlist,
  getSharedWishlist,
  checkPriceDrops
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const addToWishlistValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('notifyOnPriceDrop').optional().isBoolean().withMessage('Notify on price drop must be boolean'),
  body('notifyOnRestock').optional().isBoolean().withMessage('Notify on restock must be boolean'),
  body('targetPrice').optional().isFloat({ min: 0 }).withMessage('Target price must be valid')
];

const shareValidation = [
  body('name').optional().trim(),
  body('isPublic').isBoolean().withMessage('isPublic must be boolean')
];

// Public route for shared wishlists
router.get('/shared/:token', getSharedWishlist);

// Protected routes
router.use(protect);

router.get('/check-price-drops', checkPriceDrops);
router.get('/', getWishlist);
router.post('/items', addToWishlistValidation, validate, addToWishlist);
router.put('/items/:productId', validateObjectId('productId'), updateWishlistItem);
router.delete('/items/:productId', validateObjectId('productId'), removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/items/:productId/move-to-cart', validateObjectId('productId'), moveToCart);
router.post('/move-all-to-cart', moveAllToCart);
router.put('/share', shareValidation, validate, shareWishlist);

module.exports = router;

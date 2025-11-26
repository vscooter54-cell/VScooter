const express = require('express');
const {
  getProductReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
  moderateReview,
  respondToReview,
  getReviewStats
} = require('../controllers/reviewController');

const { protect, authorize } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('product').notEmpty().withMessage('Product is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
];

const moderateValidation = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
];

// Public routes
router.get('/product/:productId', validateObjectId('productId'), getProductReviews);

// Protected routes
router.use(protect);

router.get('/my-reviews', getMyReviews);
router.post('/', reviewValidation, validate, createReview);
router.put('/:id', validateObjectId('id'), updateReview);
router.delete('/:id', validateObjectId('id'), deleteReview);
router.post('/:id/helpful', validateObjectId('id'), markHelpful);

// Admin routes
router.use(authorize('admin'));

router.get('/stats/overview', getReviewStats);
router.get('/', getAllReviews);
router.put('/:id/moderate', validateObjectId('id'), moderateValidation, validate, moderateReview);
router.post('/:id/respond', validateObjectId('id'), respondToReview);

module.exports = router;

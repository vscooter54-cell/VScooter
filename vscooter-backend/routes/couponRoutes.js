const express = require('express');
const {
  validateCoupon,
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  deactivateCoupon,
  getCouponStats,
  getAllCouponStats,
  checkUserUsage
} = require('../controllers/couponController');

const { protect, authorize } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const validateCouponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a valid number')
];

const couponValidation = [
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('description.en').optional().trim(),
  body('description.de').optional().trim(),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  body('discountValue.USD').optional().isFloat({ min: 0 }).withMessage('USD value must be valid'),
  body('discountValue.EUR').optional().isFloat({ min: 0 }).withMessage('EUR value must be valid'),
  body('validFrom').optional().isISO8601().withMessage('Valid from must be a valid date'),
  body('validUntil').optional().isISO8601().withMessage('Valid until must be a valid date')
];

// Protected routes
router.use(protect);

router.post('/validate', validateCouponValidation, validate, validateCoupon);
router.get('/check-usage/:code', checkUserUsage);

// Admin routes
router.use(authorize('admin'));

router.get('/stats/overview', getAllCouponStats);
router.get('/:id/stats', validateObjectId('id'), getCouponStats);
router.get('/:id', validateObjectId('id'), getCoupon);
router.get('/', getCoupons);
router.post('/', couponValidation, validate, createCoupon);
router.put('/:id', validateObjectId('id'), updateCoupon);
router.delete('/:id', validateObjectId('id'), deleteCoupon);
router.put('/:id/deactivate', validateObjectId('id'), deactivateCoupon);

module.exports = router;

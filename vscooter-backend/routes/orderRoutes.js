const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updateShipping,
  updatePaymentStatus,
  processRefund,
  getOrderStats
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['credit_card', 'paypal', 'stripe']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
];

// Protected routes
router.use(protect);

router.post('/', createOrderValidation, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', validateObjectId('id'), getOrder);
router.put('/:id/cancel', validateObjectId('id'), cancelOrder);

// Admin routes
router.use(authorize('admin'));

router.get('/stats/overview', getOrderStats);
router.get('/', getAllOrders);
router.put('/:id/status', validateObjectId('id'), updateStatusValidation, validate, updateOrderStatus);
router.put('/:id/shipping', validateObjectId('id'), updateShipping);
router.put('/:id/payment', validateObjectId('id'), updatePaymentStatus);
router.post('/:id/refund', validateObjectId('id'), processRefund);

module.exports = router;

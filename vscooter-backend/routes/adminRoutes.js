const express = require('express');
const {
  getDashboardStats,
  getCustomers,
  getCustomerDetails,
  getSettings,
  updateSettings,
  getAnalytics
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Customers (CRM)
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);

// Settings
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;

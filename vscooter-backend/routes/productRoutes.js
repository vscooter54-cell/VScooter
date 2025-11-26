const express = require('express');
const {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getCategories,
  getTags,
  getFeaturedProducts,
  getRelatedProducts,
  checkStock
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name.en').trim().notEmpty().withMessage('English name is required'),
  body('name.de').trim().notEmpty().withMessage('German name is required'),
  body('description.en').trim().notEmpty().withMessage('English description is required'),
  body('description.de').trim().notEmpty().withMessage('German description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('pricing.regularPrice.USD').isFloat({ min: 0 }).withMessage('USD price must be valid'),
  body('pricing.regularPrice.EUR').isFloat({ min: 0 }).withMessage('EUR price must be valid'),
  body('inventory.stock').isInt({ min: 0 }).withMessage('Stock must be a positive number')
];

const inventoryValidation = [
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive number'),
  body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Low stock threshold must be positive')
];

// Public routes
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/featured', getFeaturedProducts);
router.post('/check-stock', checkStock);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', validateObjectId('id'), getRelatedProducts);
router.get('/:id', validateObjectId('id'), getProduct);
router.get('/', getProducts);

// Admin routes
router.post('/', protect, authorize('admin'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), validateObjectId('id'), updateProduct);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteProduct);
router.patch('/:id/inventory', protect, authorize('admin'), validateObjectId('id'), inventoryValidation, validate, updateInventory);

module.exports = router;

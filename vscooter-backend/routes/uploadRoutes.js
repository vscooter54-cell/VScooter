const express = require('express');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All upload routes require admin authentication
router.post('/image', protect, authorize('admin'), uploadImage);
router.post('/images', protect, authorize('admin'), uploadImages);

// Delete uses named wildcard to capture publicId with slashes (e.g., vscooter/products/product-123)
// Express 5 requires named parameters for wildcards
router.delete('/image/:publicId(*)', protect, authorize('admin'), deleteImage);

module.exports = router;

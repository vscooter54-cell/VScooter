const express = require('express');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All upload routes require admin authentication
router.post('/image', protect, authorize('admin'), uploadImage);
router.post('/images', protect, authorize('admin'), uploadImages);

// Delete uses wildcard to capture publicId with slashes (e.g., vscooter/products/product-123)
router.delete('/image/*', protect, authorize('admin'), (req, res) => {
  // Get the publicId from the URL path after /image/
  req.params.publicId = req.params[0];
  deleteImage(req, res);
});

module.exports = router;

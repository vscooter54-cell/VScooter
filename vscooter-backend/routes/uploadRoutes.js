const express = require('express');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All upload routes require admin authentication
router.post('/image', protect, authorize('admin'), uploadImage);
router.post('/images', protect, authorize('admin'), uploadImages);
router.delete('/image/:filename', protect, authorize('admin'), deleteImage);

module.exports = router;

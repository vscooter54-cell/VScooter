const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    product: req.params.productId,
    status: 'approved'
  };

  // Filter by rating
  if (req.query.rating) {
    query.rating = parseInt(req.query.rating);
  }

  // Filter by verified purchase
  if (req.query.verified === 'true') {
    query.isVerifiedPurchase = true;
  }

  // Sort
  let sortBy = '-createdAt';
  if (req.query.sort === 'helpful') {
    sortBy = '-helpfulCount';
  } else if (req.query.sort === 'rating-high') {
    sortBy = '-rating';
  } else if (req.query.sort === 'rating-low') {
    sortBy = 'rating';
  }

  const reviews = await Review.find(query)
    .populate('user', 'firstName lastName')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(query);

  // Get rating breakdown
  const ratingBreakdown = await Review.aggregate([
    { $match: { product: req.params.productId, status: 'approved' } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    ratingBreakdown,
    data: reviews
  });
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('product', 'name images')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  const { product, rating, title, comment, images } = req.body;

  // Check if product exists
  const productDoc = await Product.findById(product);

  if (!productDoc) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user.id,
    product
  });

  if (existingReview) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  // Check if user purchased this product
  const order = await Order.findOne({
    user: req.user.id,
    'items.product': product,
    status: 'delivered'
  });

  const isVerifiedPurchase = !!order;

  // Create review
  const review = await Review.create({
    user: req.user.id,
    product,
    rating,
    title,
    comment,
    images: images || [],
    isVerifiedPurchase
  });

  // Update product rating
  await Review.updateProductRating(product);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully. It will be visible after moderation.',
    data: review
  });
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this review', 403));
  }

  const { rating, title, comment, images } = req.body;

  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  review.images = images || review.images;
  review.status = 'pending'; // Reset to pending after edit

  await review.save();

  // Update product rating
  await Review.updateProductRating(review.product);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review
  });
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  const productId = review.product;

  await review.remove();

  // Update product rating
  await Review.updateProductRating(productId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: {}
  });
});

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
exports.markHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  const result = await review.markHelpful(req.user.id);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: result.message,
    data: review
  });
});

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.rating) {
    query.rating = parseInt(req.query.rating);
  }

  if (req.query.verified === 'true') {
    query.isVerifiedPurchase = true;
  }

  const reviews = await Review.find(query)
    .populate('user', 'firstName lastName email')
    .populate('product', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: reviews
  });
});

/**
 * @desc    Moderate review (approve/reject)
 * @route   PUT /api/reviews/:id/moderate
 * @access  Private/Admin
 */
exports.moderateReview = asyncHandler(async (req, res, next) => {
  const { status, adminNotes } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  const result = await review.moderate(status, adminNotes);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  // Update product rating if approved
  if (status === 'approved') {
    await Review.updateProductRating(review.product);
  }

  // TODO: Send email notification to user

  res.status(200).json({
    success: true,
    message: result.message,
    data: review
  });
});

/**
 * @desc    Add admin response to review
 * @route   POST /api/reviews/:id/respond
 * @access  Private/Admin
 */
exports.respondToReview = asyncHandler(async (req, res, next) => {
  const { response } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  const result = await review.addAdminResponse(response);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  // TODO: Send notification to user

  res.status(200).json({
    success: true,
    message: 'Response added successfully',
    data: review
  });
});

/**
 * @desc    Get review statistics (Admin)
 * @route   GET /api/reviews/stats/overview
 * @access  Private/Admin
 */
exports.getReviewStats = asyncHandler(async (req, res, next) => {
  const stats = await Review.aggregate([
    {
      $facet: {
        statusBreakdown: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        ratingDistribution: [
          { $group: { _id: '$rating', count: { $sum: 1 } } },
          { $sort: { _id: -1 } }
        ],
        verifiedVsUnverified: [
          { $group: { _id: '$isVerifiedPurchase', count: { $sum: 1 } } }
        ],
        totalStats: [
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: '$rating' },
              totalHelpfulVotes: { $sum: '$helpfulCount' }
            }
          }
        ]
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0]
  });
});

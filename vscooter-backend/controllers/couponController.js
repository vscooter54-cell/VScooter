const Coupon = require('../models/Coupon');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Validate coupon code
 * @route   POST /api/coupons/validate
 * @access  Private
 */
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 400));
  }

  const validation = await coupon.canBeUsed(req.user.id, subtotal);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.reason
    });
  }

  // Calculate discount
  const discount = coupon.calculateDiscount(subtotal);

  res.status(200).json({
    success: true,
    message: 'Coupon is valid',
    data: {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount
    }
  });
});

/**
 * @desc    Get all coupons (Admin)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
exports.getCoupons = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  // Filter by status
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  // Filter by type
  if (req.query.discountType) {
    query.discountType = req.query.discountType;
  }

  const coupons = await Coupon.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Coupon.countDocuments(query);

  res.status(200).json({
    success: true,
    count: coupons.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: coupons
  });
});

/**
 * @desc    Get single coupon (Admin)
 * @route   GET /api/coupons/:id
 * @access  Private/Admin
 */
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

/**
 * @desc    Create coupon (Admin)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
exports.createCoupon = asyncHandler(async (req, res, next) => {
  // Check if code already exists
  const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });

  if (existingCoupon) {
    return next(new ErrorResponse('Coupon code already exists', 400));
  }

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

/**
 * @desc    Update coupon (Admin)
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  // If updating code, check if new code already exists
  if (req.body.code && req.body.code !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existingCoupon) {
      return next(new ErrorResponse('Coupon code already exists', 400));
    }
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Coupon updated successfully',
    data: coupon
  });
});

/**
 * @desc    Delete coupon (Admin)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  await coupon.remove();

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully',
    data: {}
  });
});

/**
 * @desc    Deactivate coupon (Admin)
 * @route   PUT /api/coupons/:id/deactivate
 * @access  Private/Admin
 */
exports.deactivateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  const result = await coupon.deactivate();

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: result.message,
    data: coupon
  });
});

/**
 * @desc    Get coupon usage statistics (Admin)
 * @route   GET /api/coupons/:id/stats
 * @access  Private/Admin
 */
exports.getCouponStats = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  const stats = await coupon.getUsageStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Get all coupon statistics (Admin)
 * @route   GET /api/coupons/stats/overview
 * @access  Private/Admin
 */
exports.getAllCouponStats = asyncHandler(async (req, res, next) => {
  const stats = await Coupon.aggregate([
    {
      $facet: {
        statusBreakdown: [
          { $group: { _id: '$isActive', count: { $sum: 1 } } }
        ],
        typeBreakdown: [
          { $group: { _id: '$discountType', count: { $sum: 1 } } }
        ],
        usageStats: [
          {
            $group: {
              _id: null,
              totalCoupons: { $sum: 1 },
              totalUsage: { $sum: '$usage.totalUsed' },
              averageUsage: { $avg: '$usage.totalUsed' }
            }
          }
        ],
        topCoupons: [
          { $sort: { 'usage.totalUsed': -1 } },
          { $limit: 10 },
          {
            $project: {
              code: 1,
              description: 1,
              discountType: 1,
              discountValue: 1,
              totalUsed: '$usage.totalUsed'
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

/**
 * @desc    Check user coupon usage
 * @route   GET /api/coupons/check-usage/:code
 * @access  Private
 */
exports.checkUserUsage = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  const userUsage = await coupon.getUserUsageCount(req.user.id);
  const canUse = userUsage < (coupon.usage.maxUsesPerUser || Infinity);

  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      userUsage,
      maxUsesPerUser: coupon.usage.maxUsesPerUser,
      canUse,
      remainingUses: coupon.usage.maxUsesPerUser ? coupon.usage.maxUsesPerUser - userUsage : null
    }
  });
});
